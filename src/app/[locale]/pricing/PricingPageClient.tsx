'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check, X, Star, Users, Store } from 'lucide-react';
import { HelpButton } from '@/components/ui/HelpButton';
import { useState } from 'react';

interface PricingPageClientProps {
  user?: { id: string; email?: string } | null;
  userRole?: string | null;
  isPro?: boolean;
}

type Tab = 'user' | 'seller';

interface PlanCardProps {
  name: string;
  badge?: string;
  price: string;
  period: string;
  subNote?: string;
  desc: string;
  features: { label: string; included: boolean }[];
  cta: string;
  ctaHref: string;
  currentPlanLabel: string;
  highlight?: boolean;
  current?: boolean;
}

function PlanCard({ name, badge, price, period, subNote, desc, features, cta, ctaHref, highlight, current, currentPlanLabel }: PlanCardProps) {
  return (
    <div className={`glass-card p-8 relative flex flex-col ${highlight ? 'border-2 border-primary' : ''}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          {badge}
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-muted text-sm">{desc}</p>
      </div>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted ml-1 text-sm">{period}</span>
        {subNote && <p className="text-xs text-muted mt-1">{subNote}</p>}
      </div>
      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {f.included
              ? <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              : <X className="w-4 h-4 text-muted mt-0.5 shrink-0" />}
            <span className={f.included ? '' : 'text-muted'}>{f.label}</span>
          </li>
        ))}
      </ul>
      {current ? (
        <div className="w-full py-3 text-center border border-primary text-primary rounded-xl font-medium text-sm">
          {currentPlanLabel}
        </div>
      ) : (
        <Link
          href={ctaHref}
          className={`block w-full py-3 text-center rounded-xl font-medium text-sm transition-all ${
            highlight
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'border border-border hover:bg-surface-hover'
          }`}
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

export function PricingPageClient({ user, userRole, isPro }: PricingPageClientProps) {
  const t = useTranslations();
  const [yearly, setYearly] = useState(false);
  const [tab, setTab] = useState<Tab>('user');

  const userProMonthly = 4.99;
  const sellerProMonthly = 9.99;

  // Annual totals (20% off 12 months)
  const userProYearlyTotal = (userProMonthly * 12 * 0.8).toFixed(2);
  const sellerProYearlyTotal = (sellerProMonthly * 12 * 0.8).toFixed(2);

  const userProPrice = yearly ? userProYearlyTotal : userProMonthly.toFixed(2);
  const sellerFreePrice = '0';
  const sellerProPrice = yearly ? sellerProYearlyTotal : sellerProMonthly.toFixed(2);
  const period = yearly ? t('pricing.perYear') : t('pricing.perMonth');
  const userProSubNote = yearly ? `≈ €${(userProMonthly * 0.8).toFixed(2)}/mo · ${t('pricing.billedAnnually')}` : '';
  const sellerProSubNote = yearly ? `≈ €${(sellerProMonthly * 0.8).toFixed(2)}/mo · ${t('pricing.billedAnnually')}` : '';
  const currentPlanLabel = t('pricing.currentPlanButton');

  const userPlans: PlanCardProps[] = [
    {
      name: t('pricing.userFreeName'),
      price: '0',
      period: t('pricing.foreverFree'),
      desc: t('pricing.userFreeDesc'),
      cta: t('pricing.getStartedCta'),
      ctaHref: '/register',
      currentPlanLabel,
      features: [
        { label: t('pricing.userFreeFeature1'), included: true },
        { label: t('pricing.userFreeFeature2'), included: true },
        { label: t('pricing.userFreeFeature3'), included: true },
        { label: t('pricing.userFreeFeature4'), included: true },
        { label: t('pricing.userFreeFeature5'), included: true },
        { label: t('pricing.userFreeFeature6'), included: false },
        { label: t('pricing.userFreeFeature7'), included: false },
        { label: t('pricing.userFreeFeature8'), included: false },
        { label: t('pricing.userFreeFeature9'), included: false },
      ],
    },
    {
      name: t('pricing.userProName'),
      badge: t('pricing.badgeMostPopular'),
      price: userProPrice,
      period,
      subNote: userProSubNote || undefined,
      desc: t('pricing.userProDesc'),
      cta: t('pricing.upgradeToPro'),
      ctaHref: '/register',
      highlight: true,
      currentPlanLabel,
      features: [
        { label: t('pricing.userProFeature1'), included: true },
        { label: t('pricing.userProFeature2'), included: true },
        { label: t('pricing.userProFeature3'), included: true },
        { label: t('pricing.userProFeature4'), included: true },
        { label: t('pricing.userProFeature5'), included: true },
        { label: t('pricing.userProFeature6'), included: true },
        { label: t('pricing.userProFeature7'), included: true },
        { label: t('pricing.userProFeature8'), included: true },
      ],
    },
  ];

  const sellerPlans: PlanCardProps[] = [
    {
      name: t('pricing.sellerFreeName'),
      price: sellerFreePrice,
      period: t('pricing.foreverFree'),
      desc: t('pricing.sellerFreeDesc'),
      cta: t('pricing.registerAsSeller'),
      ctaHref: '/register',
      currentPlanLabel,
      features: [
        { label: t('pricing.sellerFreeFeature1'), included: true },
        { label: t('pricing.sellerFreeFeature2'), included: true },
        { label: t('pricing.sellerFreeFeature3'), included: true },
        { label: t('pricing.sellerFreeFeature4'), included: true },
        { label: t('pricing.sellerFreeFeature5'), included: true },
        { label: t('pricing.sellerFreeFeature6'), included: true },
        { label: t('pricing.sellerFreeFeature7'), included: false },
        { label: t('pricing.sellerFreeFeature8'), included: false },
        { label: t('pricing.sellerFreeFeature9'), included: false },
        { label: t('pricing.sellerFreeFeature10'), included: false },
        { label: t('pricing.sellerFreeFeature11'), included: false },
      ],
    },
    {
      name: t('pricing.sellerProName'),
      badge: t('pricing.badgeBestForSellers'),
      price: sellerProPrice,
      period,
      subNote: sellerProSubNote || undefined,
      desc: t('pricing.sellerProDesc'),
      cta: t('pricing.goSellerPro'),
      ctaHref: '/register',
      highlight: true,
      currentPlanLabel,
      features: [
        { label: t('pricing.sellerProFeature1'), included: true },
        { label: t('pricing.sellerProFeature2'), included: true },
        { label: t('pricing.sellerProFeature3'), included: true },
        { label: t('pricing.sellerProFeature4'), included: true },
        { label: t('pricing.sellerProFeature5'), included: true },
        { label: t('pricing.sellerProFeature6'), included: true },
        { label: t('pricing.sellerProFeature7'), included: true },
        { label: t('pricing.sellerProFeature8'), included: true },
        { label: t('pricing.sellerProFeature9'), included: true },
        { label: t('pricing.sellerProFeature10'), included: true },
      ],
    },
  ];

  const activePlans = tab === 'user' ? userPlans : sellerPlans;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userRole={userRole} isPro={isPro} />
      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
            <p className="text-muted text-lg">{t('pricing.subtitle')}</p>
            <div className="mt-2 inline-flex">
              <HelpButton content={t('help.pages.pricing')} />
            </div>
          </div>

          {/* User / Seller tab toggle */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setTab('user')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === 'user' ? 'bg-primary text-white shadow' : 'bg-surface border border-border hover:bg-surface-hover'
              }`}
            >
              <Users className="w-4 h-4" />
              {t('pricing.forBuyers')}
            </button>
            <button
              onClick={() => setTab('seller')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === 'seller' ? 'bg-primary text-white shadow' : 'bg-surface border border-border hover:bg-surface-hover'
              }`}
            >
              <Store className="w-4 h-4" />
              {t('pricing.forSellers')}
            </button>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`text-sm font-medium ${!yearly ? 'text-foreground' : 'text-muted'}`}>{t('pricing.monthly')}</span>
            <button
              type="button"
              role="switch"
              aria-checked={yearly}
              onClick={() => setYearly(!yearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${yearly ? 'bg-primary' : 'bg-border'}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${yearly ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium ${yearly ? 'text-foreground' : 'text-muted'}`}>
              {t('pricing.yearly')} <span className="text-primary text-xs font-semibold">({t('pricing.savePercent')})</span>
            </span>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {activePlans.map((plan) => (
              <PlanCard key={plan.name} {...plan} current={isPro && plan.highlight} />
            ))}
          </div>

          {/* Note */}
          <p className="text-center text-xs text-muted mt-8">
            {t('pricing.freeTrial')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
