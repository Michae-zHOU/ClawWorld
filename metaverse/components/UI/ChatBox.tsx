'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messages = useGameStore((s) => s.chatMessages);
  const addMessage = useGameStore((s) => s.addChatMessage);
  const agent = useGameStore((s) => s.agent);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const send = () => {
    if (!input.trim() || !agent) return;
    addMessage(agent.name, input.trim());
    setInput('');
  };

  return (
    <div className="absolute bottom-14 left-3 z-10 pointer-events-auto">
      <button
        onClick={() => setOpen(!open)}
        className="mb-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
      >
        Chat {open ? '▼' : '▲'}
      </button>

      {open && (
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl w-72 overflow-hidden">
          <div ref={scrollRef} className="h-40 overflow-y-auto p-2 space-y-1">
            {messages.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-4">No messages yet</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-purple-400">{msg.from}: </span>
                <span className="text-gray-300">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Say something..."
              className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
            />
            <button
              onClick={send}
              className="px-3 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
