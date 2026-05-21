'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check, Star, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const t = useTranslations();
  const [yearly, setYearly] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
            <p className="text-muted text-lg">{t('pricing.subtitle')}</p>
            <button onClick={() => setShowHelp(!showHelp)} className="mt-2 p-2 rounded-lg hover:bg-surface-hover inline-flex">
              <HelpCircle className="w-5 h-5 text-muted" />
            </button>
          </div>

          {showHelp && (
            <div className="mb-8 p-4 glass-card bg-primary/5 text-center">
              <p className="text-sm text-muted">{t('help.tooltip')}</p>
            </div>
          )}

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!yearly ? 'text-foreground' : 'text-muted'}`}>{t('pricing.monthly')}</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? 'bg-primary' : 'bg-border'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${yearly ? 'left-8' : 'left-1'}`} />
            </button>
            <span className={`text-sm font-medium ${yearly ? 'text-foreground' : 'text-muted'}`}>
              {t('pricing.yearly')} <span className="text-primary text-xs">({t('pricing.savePercent')})</span>
            </span>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-2">{t('pricing.freePlan')}</h3>
              <p className="text-muted text-sm mb-6">{t('pricing.freePlanDesc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">0</span>
                <span className="text-muted ml-1">EUR</span>
              </div>
              <ul className="space-y-3 mb-8">
                {(['f1', 'f2', 'f3', 'f4', 'f5'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{t(`pricing.freeFeatures.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3 text-center border border-border rounded-xl font-medium hover:bg-surface-hover transition-all">
                {t('common.getStarted')}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass-card p-8 relative border-2 border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                {t('pricing.mostPopular')}
              </div>
              <h3 className="text-xl font-bold mb-2">{t('pricing.proPlan')}</h3>
              <p className="text-muted text-sm mb-6">{t('pricing.proPlanDesc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{yearly ? t('pricing.proPriceYr') : t('pricing.proPriceMo')}</span>
                <span className="text-muted ml-1">EUR / {yearly ? t('pricing.yearly').toLowerCase() : t('pricing.monthly').toLowerCase()}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {(['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{t(`pricing.proFeatures.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3 text-center bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all">
                {t('pricing.choosePlan')}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
