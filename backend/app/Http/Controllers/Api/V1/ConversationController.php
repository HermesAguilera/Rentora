<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Space;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    /** Conversaciones del usuario, con el último mensaje y los no leídos. */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->where('renter_id', $user->id)
            ->orWhere('host_id', $user->id)
            ->with(['renter', 'host', 'space:id,title'])
            ->withCount(['messages as unread_count' => function ($query) use ($user) {
                $query->whereNull('read_at')->where('sender_id', '!=', $user->id);
            }])
            ->with(['messages' => fn ($query) => $query->latest('id')->limit(1)])
            ->orderByDesc('last_message_at')
            ->get();

        return response()->json([
            'data' => $conversations->map(function (Conversation $conversation) use ($user) {
                $counterpart = $conversation->counterpartFor($user);
                $last = $conversation->messages->first();

                return [
                    'id' => $conversation->uuid,
                    'contact_name' => $counterpart->full_name,
                    'contact_avatar_url' => $counterpart->avatar_path,
                    'space_title' => $conversation->space?->title,
                    'last_message_preview' => $last?->body,
                    'last_message_at' => $conversation->last_message_at,
                    'unread_count' => $conversation->unread_count,
                ];
            }),
        ]);
    }

    /** Mensajes de una conversación. Al abrirla se marcan como leídos. */
    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        abort_unless($conversation->includes($user), 403, 'Esta conversación no es tuya.');

        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()->orderBy('id')->get();

        return response()->json([
            'data' => $messages->map(fn (Message $message) => [
                'id' => $message->uuid,
                'conversation_id' => $conversation->uuid,
                'mine' => $message->sender_id === $user->id,
                'body' => $message->body,
                'sent_at' => $message->created_at,
            ]),
        ]);
    }

    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        abort_unless($conversation->includes($user), 403, 'Esta conversación no es tuya.');

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = DB::transaction(function () use ($conversation, $user, $validated) {
            $message = $conversation->messages()->create([
                'sender_id' => $user->id,
                'body' => $validated['body'],
            ]);

            $conversation->update(['last_message_at' => $message->created_at]);

            return $message;
        });

        return response()->json([
            'data' => [
                'id' => $message->uuid,
                'conversation_id' => $conversation->uuid,
                'mine' => true,
                'body' => $message->body,
                'sent_at' => $message->created_at,
            ],
        ], 201);
    }

    /**
     * Abre (o reutiliza) la conversación con el anfitrión de un espacio.
     * Es el botón "Contactar al anfitrión" del detalle del espacio.
     */
    public function startForSpace(Request $request, Space $space): JsonResponse
    {
        $user = $request->user();

        if ($space->host_id === $user->id) {
            return response()->json(['message' => 'No puedes escribirte a ti mismo.'], 422);
        }

        $conversation = Conversation::firstOrCreate(
            [
                'space_id' => $space->id,
                'renter_id' => $user->id,
                'host_id' => $space->host_id,
            ],
            ['last_message_at' => now()],
        );

        return response()->json(['data' => ['id' => $conversation->uuid]], 201);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = Message::whereHas(
            'conversation',
            fn ($query) => $query->where('renter_id', $user->id)->orWhere('host_id', $user->id),
        )
            ->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->count();

        return response()->json(['count' => $count]);
    }
}
