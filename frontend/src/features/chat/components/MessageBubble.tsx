import { formatMessageTime } from '../../../utils/date';
import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMine = message.sender === 'me';

  return (
    <div className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-md whitespace-pre-wrap break-words px-5 py-3 font-['Quicksand',sans-serif] text-sm ${
          isMine
            ? 'rounded-l-2xl rounded-tr-2xl bg-[#4d44b5] text-white'
            : 'rounded-r-2xl rounded-tl-2xl bg-[#f5f5f5] text-[#2b3073]'
        }`}
      >
        {message.text}
      </div>
      <span className="font-['Quicksand',sans-serif] text-xs text-[#a098ae]">
        {formatMessageTime(message.sentAt)}
      </span>
    </div>
  );
}
