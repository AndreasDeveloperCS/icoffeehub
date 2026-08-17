'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('auth.genericError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <p className="section-eyebrow">{t('auth.welcomeBack')}</p>
        <h1 className="mt-1.5 font-heading text-2xl font-bold text-espresso-800">{t('auth.signInTitle')}</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">{t('auth.email')}</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">{t('auth.password')}</label>
            <input id="password" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('auth.signingIn') : t('common.signIn')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-espresso-500">
          {t('auth.newToHub')}{' '}
          <Link href="/register" className="font-semibold text-espresso-800 hover:underline">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
