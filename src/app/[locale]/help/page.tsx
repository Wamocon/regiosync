'use server';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HelpCircle, Book, Mail, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function HelpPage() {
  const t = useTranslations();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('role,is_pro').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userRole={profile?.role} isPro={profile?.is_pro} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">{t('help.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 text-center">
            <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('help.faq')}</h3>
            <p className="text-sm text-muted">Find answers to common questions about RegioSync.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Book className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('help.documentation')}</h3>
            <p className="text-sm text-muted">Read the complete user guide and documentation.</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('help.contactUs')}</h3>
            <p className="text-sm text-muted">Get in touch with our support team.</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold mb-6">{t('help.faq')}</h2>
          <div className="space-y-4">
            <FaqItem
              question="How do I create a shop?"
              questionDe="Wie erstelle ich einen Laden?"
              answer="Register as a seller, then navigate to your dashboard and click 'Create Shop'. Fill in the details and use GPS for accurate location."
              answerDe="Registriere dich als Verkaeufer, navigiere dann zu deinem Dashboard und klicke auf 'Laden erstellen'. Fuelle die Details aus und verwende GPS fuer einen genauen Standort."
            />
            <FaqItem
              question="What are the differences between Free and Pro?"
              questionDe="Was sind die Unterschiede zwischen Free und Pro?"
              answer="Pro users get unlimited shop browsing, full map access with zoom, directions to shops, priority requests, and exclusive deals."
              answerDe="Pro-Benutzer erhalten unbegrenzten Zugang zu Geschaeften, volle Kartenfunktion mit Zoom, Wegbeschreibungen, Prioritaets-Anfragen und exklusive Angebote."
            />
            <FaqItem
              question="How do I request a product?"
              questionDe="Wie kann ich ein Produkt anfragen?"
              answer="Visit a shop page and click 'Request Product'. Describe what you are looking for and the seller will be notified."
              answerDe="Besuche eine Ladenseite und klicke auf 'Produkt anfragen'. Beschreibe was du suchst und der Verkaeufer wird benachrichtigt."
            />
            <FaqItem
              question="How do I report a problem?"
              questionDe="Wie melde ich ein Problem?"
              answer="Contact our support team at info@wamocon.de or use the contact form."
              answerDe="Kontaktiere unser Support-Team unter info@wamocon.de oder nutze das Kontaktformular."
            />
          </div>
        </div>

        <div className="glass-card p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">{t('help.contactUs')}</h2>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <p>info@wamocon.de</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FaqItem({ question, questionDe, answer, answerDe }: { question: string; questionDe: string; answer: string; answerDe: string }) {
  return (
    <details className="group">
      <summary className="cursor-pointer font-medium text-sm py-3 px-4 rounded-xl hover:bg-surface-hover transition-colors list-none flex items-center justify-between">
        <span>{question} / {questionDe}</span>
        <span className="text-muted group-open:rotate-180 transition-transform">&#9662;</span>
      </summary>
      <div className="px-4 pb-3 text-sm text-muted">
        <p className="mb-1">{answer}</p>
        <p className="italic">{answerDe}</p>
      </div>
    </details>
  );
}
