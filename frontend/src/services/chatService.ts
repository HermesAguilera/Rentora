import type { ChatMessage, Conversation } from '../features/chat/types';

/**
 * Mock data layer for the "Mensajes" chat module.
 *
 * Every function returns a Promise with the exact shape the real API is
 * expected to return, so swapping the body for an `axios` call later does
 * not require touching any component or hook.
 */

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    contactName: 'María López',
    contactAvatarUrl: null,
    lastMessagePreview: 'Lorem ipsum dolor sit amet...',
    lastMessageAt: '2026-07-24T12:45:00Z',
    unreadCount: 2,
    online: true,
  },
  {
    id: 'conv-2',
    contactName: 'Tony Gomez',
    contactAvatarUrl: null,
    lastMessagePreview: 'Lorem ipsum dolor sit amet...',
    lastMessageAt: '2026-07-24T12:45:00Z',
    unreadCount: 2,
    online: false,
  },
  {
    id: 'conv-3',
    contactName: 'Karen Hernandez',
    contactAvatarUrl: null,
    lastMessagePreview: 'Lorem ipsum dolor sit amet...',
    lastMessageAt: '2026-07-24T12:45:00Z',
    unreadCount: 0,
    online: false,
  },
];

const MESSAGES_BY_CONVERSATION: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      sender: 'contact',
      text: 'Hola Pedro!',
      sentAt: '2026-07-24T12:40:00Z',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      sender: 'contact',
      text: '¿El espacio tiene acceso los fines de semana también?',
      sentAt: '2026-07-24T12:42:00Z',
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      sender: 'me',
      text: 'Hola María! Sí, claro.',
      sentAt: '2026-07-24T12:44:00Z',
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      sender: 'me',
      text: 'El acceso es de lunes a domingo de 6am a 10pm.',
      sentAt: '2026-07-24T12:45:00Z',
    },
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      sender: 'contact',
      text: 'Hola! ¿Sigue disponible la bodega?',
      sentAt: '2026-07-24T11:10:00Z',
    },
  ],
  'conv-3': [
    {
      id: 'msg-6',
      conversationId: 'conv-3',
      sender: 'contact',
      text: 'Gracias por la información.',
      sentAt: '2026-07-23T09:00:00Z',
    },
  ],
};

export function getConversations(): Promise<Conversation[]> {
  return delay([...CONVERSATIONS]);
}

export function getMessages(conversationId: string): Promise<ChatMessage[]> {
  return delay([...(MESSAGES_BY_CONVERSATION[conversationId] ?? [])]);
}

export function sendMessage(conversationId: string, text: string): Promise<ChatMessage> {
  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    sender: 'me',
    text,
    sentAt: new Date().toISOString(),
  };
  MESSAGES_BY_CONVERSATION[conversationId] = [
    ...(MESSAGES_BY_CONVERSATION[conversationId] ?? []),
    message,
  ];
  return delay(message);
}
