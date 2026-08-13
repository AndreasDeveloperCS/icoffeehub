'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await register({ name, email, password, role });
      router.push(user.role === 'seller' ? '/seller' : '/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <p className="section-eyebrow">Join iCoffeeHub</p>
        <h1 className="mt-1.5 font-heading text-2xl font-bold text-espresso-800">Create your account</h1>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-cream-100 p-1">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`rounded-full py-2 text-sm font-semibold transition-colors ${role === 'customer' ? 'bg-espresso-700 text-cream-50' : 'text-espresso-600'}`}
          >
            I&apos;m a coffee lover
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`rounded-full py-2 text-sm font-semibold transition-colors ${role === 'seller' ? 'bg-espresso-700 text-cream-50' : 'text-espresso-600'}`}
          >
            I&apos;m a seller
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">{role === 'seller' ? 'Contact name' : 'Full name'}</label>
            <input id="name" required className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="mt-1 text-xs text-espresso-400">At least 8 characters.</p>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : role === 'seller' ? 'Create seller account' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-espresso-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-espresso-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
