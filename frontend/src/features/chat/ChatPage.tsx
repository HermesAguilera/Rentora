import { useState } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import type { Conversation } from './types';

export default function ChatPage() {
  const [selected, setSelected] = useState<Conversation | null>(null);

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <ConversationList selectedId={selected?.id ?? null} onSelect={setSelected} />
      <ChatWindow conversation={selected} />
    </div>
  );
}
