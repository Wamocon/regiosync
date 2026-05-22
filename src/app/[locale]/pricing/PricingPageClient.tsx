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
  desc: string;
  features: { label: string; included: boolean }[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  current?: boolean;
}

function PlanCard({ name, badge, price, period, desc, features, cta, ctaHref, highlight, current }: PlanCardProps) {
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
          Current Plan
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

  const moMult = yearly ? 0.8 : 1;
  const userProPrice = (4.99 * moMult).toFixed(2);
  const sellerFreePrice = '0';
  const sellerProPrice = (9.99 * moMult).toFixed(2);
  const period = yearly ? 'EUR / year' : 'EUR / month';

  const userPlans: PlanCardProps[] = [
    {
      name: 'User Free',
      price: '0',
      period: 'EUR — forever',
      desc: 'Discover local shops at no cost',
      cta: 'Get started',
      ctaHref: '/register',
      features: [
        { label: 'Browse up to 5 shops', included: true },
        { label: 'View products & prices', included: true },
        { label: 'Write shop reviews', included: true },
        { label: 'Subscribe to shops & products', included: true },
        { label: 'Basic map (country level)', included: true },
        { label: 'Full interactive map + zoom', included: false },
        { label: 'Get directions to shops', included: false },
        { label: 'Unlimited shop browsing', included: false },
        { label: 'Priority product requests', included: false },
      ],
    },
    {
      name: 'User Pro',
      badge: 'Most Popular',
      price: userProPrice,
      period,
      desc: 'Full regional shopping experience',
      cta: 'Upgrade to Pro',
      ctaHref: '/register',
      highlight: true,
      features: [
        { label: 'Unlimited shop browsing', included: true },
        { label: 'Full interactive map + zoom', included: true },
        { label: 'Get directions to any shop', included: true },
        { label: 'Subscribe to shops & products', included: true },
        { label: 'Priority product requests', included: true },
        { label: 'Exclusive deals & early access', included: true },
        { label: 'Advanced search & filters', included: true },
        { label: 'Push notification alerts', included: true },
      ],
    },
  ];

  const sellerPlans: PlanCardProps[] = [
    {
      name: 'Seller Free',
      price: sellerFreePrice,
      period: 'EUR — forever',
      desc: 'Start selling locally for free',
      cta: 'Register as Seller',
      ctaHref: '/register',
      features: [
        { label: '1 shop listing', included: true },
        { label: 'Up to 10 products per shop', included: true },
        { label: 'Basic shop hours schedule', included: true },
        { label: 'Manual open/close override', included: true },
        { label: 'Receive product requests', included: true },
        { label: 'Read customer reviews', included: true },
        { label: 'Multiple shops', included: false },
        { label: 'Unlimited products', included: false },
        { label: 'Subscriber analytics', included: false },
        { label: 'Priority placement in search', included: false },
        { label: 'Discount campaign automation', included: false },
      ],
    },
    {
      name: 'Seller Pro',
      badge: 'Best for Sellers',
      price: sellerProPrice,
      period,
      desc: 'Grow your local business faster',
      cta: 'Go Seller Pro',
      ctaHref: '/register',
      highlight: true,
      features: [
        { label: 'Unlimited shop listings', included: true },
        { label: 'Unlimited products per shop', included: true },
        { label: 'Full shop hours automation', included: true },
        { label: 'Manual override with calendar', included: true },
        { label: 'Subscriber analytics dashboard', included: true },
        { label: 'Auto-notify subscribers on updates', included: true },
        { label: 'Priority placement in search', included: true },
        { label: 'Discount campaign automation', included: true },
        { label: 'Featured badge on shop cards', included: true },
        { label: 'Priority support', included: true },
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
              For Buyers
            </button>
            <button
              onClick={() => setTab('seller')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === 'seller' ? 'bg-primary text-white shadow' : 'bg-surface border border-border hover:bg-surface-hover'
              }`}
            >
              <Store className="w-4 h-4" />
              For Sellers
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
            All plans include a 14-day free trial. Cancel anytime. Prices shown exclude VAT.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


interface PricingPageClientProps {
  user?: { id: string; email?: string } | null;
  userRole?: string | null;
  isPro?: boolean;
}
