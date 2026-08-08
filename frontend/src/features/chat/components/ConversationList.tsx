import { useState } from 'react';
import { Search } from 'lucide-react';
import Avatar from '../../../components/shared/Avatar';
import { useConversations } from '../hooks/useChatData';
import { formatMessageTime } from '../../../utils/date';
import type { Conversation } from '../types';

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { data: conversations, isPending, isError } = useConversations();
  const [search, setSearch] = useState('');

  const filtered = conversations?.filter((conversation) =>
    conversation.contactName.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <section className="flex w-full max-w-sm shrink-0 flex-col gap-6 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(43,48,115,0.05)]">
      <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]">Mensajes</h2>

      <label className="flex items-center gap-3 rounded-full border-2 border-[#a098ae] px-5 py-3">
        <Search className="size-5 shrink-0 text-[#a098ae]" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar conversación..."
          aria-label="Buscar conversación"
          className="w-full bg-transparent font-['Quicksand',sans-serif] text-sm text-[#2b3073] placeholder:text-[#a098ae] focus:outline-none"
        />
      </label>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        <p className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#a098ae]">
          Chats
        </p>

        {isError && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#e2665c]">
            No se pudieron cargar las conversaciones.
          </p>
        )}

        {isPending && (
          <ul className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="size-[60px] shrink-0 animate-pulse rounded-full bg-[#f4f5fc]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 animate-pulse rounded bg-[#f4f5fc]" />
                  <div className="h-3 w-24 animate-pulse rounded bg-[#f4f5fc]" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isPending && filtered && filtered.length === 0 && (
          <p className="font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
            No se encontraron conversaciones.
          </p>
        )}

        {!isPending && filtered && filtered.length > 0 && (
          <ul className="flex flex-col divide-y divide-[#f4f5fc]">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation)}
                  aria-current={conversation.id === selectedId}
                  className={`flex w-full items-center gap-4 rounded-2xl px-2 py-4 text-left transition-colors hover:bg-[#f4f5fc] ${
                    conversation.id === selectedId ? 'bg-[#f4f5fc]' : ''
                  }`}
                >
                  <Avatar name={conversation.contactName} imageUrl={conversation.contactAvatarUrl} size={60} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-['Quicksand',sans-serif] text-base font-semibold text-[#2b3073]">
                      {conversation.contactName}
                    </p>
                    <p className="truncate font-['Quicksand',sans-serif] text-sm text-[#a098ae]">
                      {conversation.lastMessagePreview}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
                      {conversation.lastMessageAt
                        ? formatMessageTime(conversation.lastMessageAt)
                        : ''}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-[#fb7d5b] font-['Quicksand',sans-serif] text-[10px] font-semibold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
