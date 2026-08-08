import { useEffect, useRef } from 'react';
import Avatar from '../../../components/shared/Avatar';
import { useMessages, useSendMessage } from '../hooks/useChatData';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import type { Conversation } from '../types';

interface ChatWindowProps {
  conversation: Conversation | null;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const conversationId = conversation?.id ?? null;
  const { data: messages, isPending } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  if (!conversation) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-3xl bg-white shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
        <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
          Selecciona una conversación para comenzar a chatear.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col rounded-3xl bg-white shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <header className="flex items-center gap-4 border-b border-[#f4f5fc] p-6">
        <Avatar name={conversation.contactName} imageUrl={conversation.contactAvatarUrl} size={64} />
        <div>
          <p className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">
            {conversation.contactName}
          </p>
          {conversation.spaceTitle && (
            <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
              Sobre: {conversation.spaceTitle}
            </p>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {isPending && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 w-48 animate-pulse rounded-2xl bg-[#f4f5fc]" />
            ))}
          </div>
        )}

        {!isPending && messages && messages.length === 0 && (
          <p className="m-auto font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
            Todavía no hay mensajes. Escribe el primero.
          </p>
        )}

        {!isPending &&
          messages?.map((message) => <MessageBubble key={message.id} message={message} />)}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={(text) => sendMessage.mutate(text)}
        disabled={sendMessage.isPending}
      />
    </section>
  );
}
