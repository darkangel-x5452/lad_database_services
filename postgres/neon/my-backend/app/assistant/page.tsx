'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function AssistantPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_POSTS_FN_URL}assistant`,
    }),
  });

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Ask about your posts</h1>
      <div className="mb-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded border p-3">
            <span className="font-medium">{m.role}: </span>
            {m.parts.map((p, i) => (p.type === 'text' ? <span key={i}>{p.text}</span> : null))}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your posts"
          className="flex-1 rounded border px-2 py-1"
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Send
        </button>
      </form>
    </main>
  );
}