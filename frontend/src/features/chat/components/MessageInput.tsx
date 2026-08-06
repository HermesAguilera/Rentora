import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Paperclip, Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [text, setText] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 border-t border-[#f4f5fc] p-6"
    >
      <label className="flex flex-1 items-center gap-3 rounded-full border-2 border-[#a098ae] px-6 py-4">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write your message..."
          aria-label="Escribe tu mensaje"
          disabled={disabled}
          className="w-full bg-transparent font-['Quicksand',sans-serif] text-sm text-[#2b3073] placeholder:text-[#a098ae] focus:outline-none"
        />
        <button
          type="button"
          aria-label="Adjuntar archivo"
          className="shrink-0 text-[#a098ae] transition-colors hover:text-[#4d44b5]"
        >
          <Paperclip className="size-5" />
        </button>
      </label>

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="flex shrink-0 items-center gap-2 rounded-full bg-[#4d44b5] px-5 py-3 font-['Quicksand',sans-serif] text-sm font-semibold text-white transition-opacity disabled:opacity-40"
      >
        Enviar
        <Send className="size-4" />
      </button>
    </form>
  );
}
