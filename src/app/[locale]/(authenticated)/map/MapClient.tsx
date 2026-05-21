'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSyncExternalStore } from 'react';
import { Lock, HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('./LeafletMap').then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted text-sm">Loading map...</p>
      </div>
    ),
  }
);

interface Shop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
}

export function MapClient({ shops, isPro }: { shops: Shop[]; isPro: boolean }) {
  const t = useTranslations();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-150 rounded-xl bg-surface border border-border flex items-center justify-center">
          <p className="text-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('map.title')}</h1>
          <p className="text-muted mt-1">{shops.length} {t('nav.shops')}</p>
        </div>
        <div className="p-2 rounded-lg hover:bg-surface-hover cursor-help" title={t('help.pages.map')}>
          <HelpCircle className="w-5 h-5 text-muted" />
        </div>
      </div>

      {!isPro && (
        <div className="mb-4 p-3 glass-card bg-accent/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-sm">{t('map.limitedView')}</span>
          </div>
          <Link href="/pricing" className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90">
            {t('common.upgrade')}
          </Link>
        </div>
      )}

      <div className="glass-card overflow-hidden" style={{ height: '600px' }}>
        <LeafletMap shops={shops} isPro={isPro} t={t} />
      </div>
    </div>
  );
}
