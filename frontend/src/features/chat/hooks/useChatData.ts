import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getConversations,
  getMessages,
  getUnreadMessageCount,
  sendMessage,
  startConversationForSpace,
} from '../../../services/chatService';
import type { ChatMessage } from '../types';

const chatKeys = {
  conversations: ['chat', 'conversations'] as const,
  unread: ['chat', 'unread'] as const,
  messages: (conversationId: string) => ['chat', 'messages', conversationId] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations,
    queryFn: getConversations,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId ?? ''),
    queryFn: () => getMessages(conversationId as string),
    enabled: conversationId !== null,
  });
}

export function useSendMessage(conversationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId as string, text),
    onMutate: async (text) => {
      if (!conversationId) return;
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) });
      const previous = queryClient.getQueryData(chatKeys.messages(conversationId));

      const optimisticMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        conversationId,
        sender: 'me',
        text,
        sentAt: new Date().toISOString(),
      };
      queryClient.setQueryData(
        chatKeys.messages(conversationId),
        (current: ChatMessage[] | undefined) => [...(current ?? []), optimisticMessage],
      );

      return { previous };
    },
    onError: (_error, _text, context) => {
      if (conversationId && context?.previous) {
        queryClient.setQueryData(chatKeys.messages(conversationId), context.previous);
      }
    },
    onSettled: () => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      }
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations });
    },
  });
}

export function useUnreadMessages() {
  return useQuery({
    queryKey: chatKeys.unread,
    queryFn: getUnreadMessageCount,
  });
}

/** Botón "Contactar al anfitrión": abre la conversación y lleva a Mensajes. */
export function useStartConversation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (spaceId: string) => startConversationForSpace(spaceId),
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations });
      navigate(`/app/mensajes?conversacion=${conversationId}`);
    },
  });
}
