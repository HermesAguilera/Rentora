import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import { useConversations } from './hooks/useChatData';
import type { Conversation } from './types';

export default function ChatPage() {
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [searchParams] = useSearchParams();
  const { data: conversations } = useConversations();

  // Al llegar desde "Contactar al anfitrión" la conversación viene en la URL.
  const requestedId = searchParams.get('conversacion');

  useEffect(() => {
    if (!requestedId || !conversations) return;
    const match = conversations.find((conversation) => conversation.id === requestedId);
    if (match) setSelected(match);
  }, [requestedId, conversations]);

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <ConversationList selectedId={selected?.id ?? null} onSelect={setSelected} />
      <ChatWindow conversation={selected} />
    </div>
  );
}
