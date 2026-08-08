import { api } from '../lib/api';
import type { ChatMessage, Conversation } from '../features/chat/types';

interface ApiConversation {
  id: string;
  contact_name: string;
  contact_avatar_url: string | null;
  space_title: string | null;
  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;
}

interface ApiMessage {
  id: string;
  conversation_id: string;
  mine: boolean;
  body: string;
  sent_at: string;
}

function toMessage(message: ApiMessage): ChatMessage {
  return {
    id: message.id,
    conversationId: message.conversation_id,
    sender: message.mine ? 'me' : 'contact',
    text: message.body,
    sentAt: message.sent_at,
  };
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<{ data: ApiConversation[] }>('/conversations');

  return data.data.map((conversation) => ({
    id: conversation.id,
    contactName: conversation.contact_name,
    contactAvatarUrl: conversation.contact_avatar_url,
    spaceTitle: conversation.space_title,
    lastMessagePreview: conversation.last_message_preview ?? 'Sin mensajes todavía',
    lastMessageAt: conversation.last_message_at,
    unreadCount: conversation.unread_count,
  }));
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data } = await api.get<{ data: ApiMessage[] }>(
    `/conversations/${conversationId}/messages`,
  );
  return data.data.map(toMessage);
}

export async function sendMessage(conversationId: string, text: string): Promise<ChatMessage> {
  const { data } = await api.post<{ data: ApiMessage }>(
    `/conversations/${conversationId}/messages`,
    { body: text },
  );
  return toMessage(data.data);
}

/** Abre (o reutiliza) la conversación con el anfitrión de un espacio. */
export async function startConversationForSpace(spaceId: string): Promise<string> {
  const { data } = await api.post<{ data: { id: string } }>(`/spaces/${spaceId}/conversation`);
  return data.data.id;
}

export async function getUnreadMessageCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>('/conversations/unread-count');
  return data.count;
}
