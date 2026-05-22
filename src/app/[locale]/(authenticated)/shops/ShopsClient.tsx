'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { Search, MapPin, Star, Store, Lock, Clock } from 'lucide-react';
import { HelpButton } from '@/components/ui/HelpButton';

interface ShopHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

interface Shop {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  owner: { full_name: string } | null;
  products: { id: string; name: string; price: number; category: string; discount: number; is_available: boolean }[];
  reviews: { rating: number }[];
  shop_hours: ShopHour[];
}

function fmtTime(t: string): string {
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function getShopStatus(shop: Shop): { isOpen: boolean; todayHours: ShopHour | null } {
  const now = new Date();
  const currentDay = now.getDay();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hh}:${mm}`;
  const todayHours = shop.shop_hours?.find(h => h.day_of_week === currentDay) ?? null;
  if (!shop.is_active) return { isOpen: false, todayHours };
  if (!todayHours || todayHours.is_closed) return { isOpen: false, todayHours };
  const open = todayHours.open_time.slice(0, 5);
  const close = todayHours.close_time.slice(0, 5);
  return { isOpen: currentTime >= open && currentTime < close, todayHours };
}

export function ShopsClient({ shops, isPro }: { shops: Shop[]; isPro: boolean }) {
  const t = useTranslations();
  const [search, setSearch] = useState('');

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
        <HelpButton content={t('help.pages.shops')} />
      </div>

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
          const { isOpen, todayHours } = getShopStatus(shop);

          return (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className={`glass-card p-5 block group relative ${!shop.is_active ? 'opacity-80' : ''}`}
            >
              {/* Open/Closed badge */}
              <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isOpen
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                {isOpen ? t('user.openNow') : t('user.closed')}
              </div>

              <div className="flex items-start gap-3 mb-3 pr-20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{shop.name}</h3>
                  <p className="text-xs text-muted">{shop.owner?.full_name}</p>
                  {avgRating && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      <span className="text-xs font-medium">{avgRating}</span>
                    </div>
                  )}
                </div>
              </div>

              {shop.description && (
                <p className="text-sm text-muted mb-3 line-clamp-2">{shop.description}</p>
              )}

              {/* Today's hours */}
              {todayHours && (
                <div className="flex items-center gap-1 text-xs text-muted mb-2">
                  <Clock className="w-3 h-3 shrink-0" />
                  {todayHours.is_closed
                    ? <span className="text-red-500">Closed today</span>
                    : <span>{fmtTime(todayHours.open_time)} - {fmtTime(todayHours.close_time)}</span>
                  }
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {shop.city || shop.address || t('user.location')}
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
          <p className="font-medium mb-2">{t('user.moreShopsAvailable', { count: hiddenCount })}</p>
          <p className="text-sm text-muted mb-4">{t('common.upgrade')}</p>
          <Link href="/pricing" className="inline-flex px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all text-sm font-medium">
            {t('common.upgrade')}
          </Link>
        </div>
      )}
    </div>
  );
}
