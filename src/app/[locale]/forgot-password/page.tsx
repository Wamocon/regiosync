'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <Image src="/logo.svg" alt="RegioSync logo" width={32} height={32} priority />
                </div>
            </div>
            <span className="text-2xl font-bold gradient-text">RegioSync</span>
          </Link>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{t('auth.resetEmailSent')}</h1>
              <p className="text-muted mb-6">{t('auth.forgotPasswordSubtitle')}</p>
              <Link href="/login" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">{t('auth.forgotPasswordTitle')}</h1>
              <p className="text-muted text-center mb-8">{t('auth.forgotPasswordSubtitle')}</p>

              <form onSubmit={handleReset} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : t('auth.sendResetLink')}
                </button>
              </form>

              <p className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-dark transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  {t('auth.backToLogin')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
