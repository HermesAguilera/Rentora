export interface Conversation {
  id: string;
  contactName: string;
  contactAvatarUrl: string | null;
  /** Espacio sobre el que se abrió la conversación. */
  spaceTitle: string | null;
  lastMessagePreview: string;
  lastMessageAt: string | null;
  unreadCount: number;
}

export type MessageSender = 'me' | 'contact';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  sentAt: string;
}
