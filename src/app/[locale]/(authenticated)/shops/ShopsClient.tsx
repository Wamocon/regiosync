'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { Search, MapPin, Star, Store, Lock, HelpCircle } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  owner: { full_name: string } | null;
  products: { id: string; name: string; price: number; category: string; discount: number; is_available: boolean }[];
  reviews: { rating: number }[];
}

export function ShopsClient({ shops, isPro }: { shops: Shop[]; isPro: boolean }) {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(search.toLowerCase()) ||
    shop.city?.toLowerCase().includes(search.toLowerCase()) ||
    shop.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Free users can only see 5 shops
  const visibleShops = isPro ? filteredShops : filteredShops.slice(0, 5);
  const hiddenCount = isPro ? 0 : Math.max(0, filteredShops.length - 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('user.nearbyShops')}</h1>
          <p className="text-muted mt-1">{filteredShops.length} {t('nav.shops')}</p>
        </div>
        <button onClick={() => setShowHelp(!showHelp)} className="p-2 rounded-lg hover:bg-surface-hover">
          <HelpCircle className="w-5 h-5 text-muted" />
        </button>
      </div>

      {showHelp && (
        <div className="mb-6 p-4 glass-card bg-primary/5">
          <p className="text-sm text-muted">{t('help.tooltip')}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('user.searchShops')}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleShops.map((shop) => {
          const avgRating = shop.reviews.length > 0
            ? (shop.reviews.reduce((sum, r) => sum + r.rating, 0) / shop.reviews.length).toFixed(1)
            : null;

          return (
            <Link key={shop.id} href={`/shops/${shop.id}`} className="glass-card p-5 block group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{shop.name}</h3>
                    <p className="text-xs text-muted">{shop.owner?.full_name}</p>
                  </div>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-medium">{avgRating}</span>
                  </div>
                )}
              </div>

              {shop.description && (
                <p className="text-sm text-muted mb-3 line-clamp-2">{shop.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {shop.city || shop.address || 'Location'}
                </span>
                <span>{shop.products.length} {t('nav.products')}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Upgrade prompt for free users */}
      {hiddenCount > 0 && (
        <div className="mt-8 glass-card p-6 text-center">
          <Lock className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="font-medium mb-2">{hiddenCount} more shops available</p>
          <p className="text-sm text-muted mb-4">{t('common.upgrade')}</p>
          <Link href="/pricing" className="inline-flex px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all text-sm font-medium">
            {t('common.upgrade')}
          </Link>
        </div>
      )}
    </div>
  );
}
