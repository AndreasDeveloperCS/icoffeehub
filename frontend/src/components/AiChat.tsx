'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { AiChatMessage } from '@/lib/types';

export function AiChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<AiChatMessage[]>('/ai/chat').then(setMessages).catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text, createdAt: new Date().toISOString() }]);
    setSending(true);
    try {
      const res = await api<{ reply: string }>('/ai/chat', { method: 'POST', body: { message: text } });
      setMessages((m) => [...m, { role: 'assistant', content: res.reply, createdAt: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card mx-auto flex max-w-2xl flex-col overflow-hidden">
      <div className="flex h-96 flex-col gap-3 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-sm text-espresso-400">{t('aiChat.emptyPrompt')}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
            m.role === 'user' ? 'ml-auto bg-espresso-700 text-cream-50' : 'bg-cream-100 text-espresso-800'
          }`}>
            {m.content}
          </div>
        ))}
        {sending && <div className="max-w-[85%] rounded-2xl bg-cream-100 px-4 py-2.5 text-sm text-espresso-400">{t('aiChat.typing')}</div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-espresso-100 p-3">
        <input
          className="input"
          placeholder={t('aiChat.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary shrink-0">{t('aiChat.send')}</button>
      </form>
    </div>
  );
}
