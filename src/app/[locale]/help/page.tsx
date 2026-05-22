import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HelpCircle, Book, Mail, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function HelpPage() {
  const t = await getTranslations();

  // Gracefully handle Supabase failures in production
  let user = null;
  let profile = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role,is_pro')
        .eq('id', user.id)
        .single();
      profile = profileData;
    }
  } catch (err) {
    console.error('[HelpPage] Supabase error:', err);
  }

  const faqItems = [
    { q: t('help.faqQ1'), a: t('help.faqA1') },
    { q: t('help.faqQ2'), a: t('help.faqA2') },
    { q: t('help.faqQ3'), a: t('help.faqA3') },
    { q: t('help.faqQ4'), a: t('help.faqA4') },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userRole={profile?.role} isPro={profile?.is_pro} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">{t('help.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 text-center">
            <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('help.faq')}</h3>
            <p className="text-sm text-muted">{t('help.faqDesc')}</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Book className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('help.documentation')}</h3>
            <p className="text-sm text-muted">{t('help.documentationDesc')}</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('help.contactUs')}</h3>
            <p className="text-sm text-muted">{t('help.contactDesc')}</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold mb-6">{t('help.faq')}</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer font-medium text-sm py-3 px-4 rounded-xl hover:bg-surface-hover transition-colors list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-muted group-open:rotate-180 transition-transform">&#9662;</span>
                </summary>
                <div className="px-4 pb-3 text-sm text-muted">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">{t('help.contactUs')}</h2>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <p>info@wamocon.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


