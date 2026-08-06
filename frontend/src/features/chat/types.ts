export interface Conversation {
  id: string;
  contactName: string;
  contactAvatarUrl: string | null;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  online: boolean;
}

export type MessageSender = 'me' | 'contact';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  sentAt: string;
}
