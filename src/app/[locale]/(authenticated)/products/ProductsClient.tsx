'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Search, Store, MapPin, Package } from 'lucide-react';
import Image from 'next/image';

type DietaryType = 'vegan' | 'vegetarian' | 'flexitarian';

const DIETARY: Record<DietaryType, { icon: string; label: string; pill: string }> = {
  vegan: { icon: '🌱', label: 'Vegan', pill: 'bg-green-500 text-white' },
  vegetarian: { icon: '🥗', label: 'Vegetarian', pill: 'bg-lime-500 text-white' },
  flexitarian: { icon: '🍗', label: 'Flexitarian', pill: 'bg-orange-500 text-white' },
};

interface Shop {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  owner: { full_name: string } | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string;
  discount: number;
  is_available: boolean;
  image_url: string | null;
  dietary_type: DietaryType | null;
  shop: Shop | null;
}

interface ShopGroup {
  shop: Shop;
  products: Product[];
}

function groupByShop(products: Product[]): ShopGroup[] {
  const map = new Map<string, ShopGroup>();
  for (const p of products) {
    if (!p.shop) continue;
    const key = p.shop.id;
    if (!map.has(key)) map.set(key, { shop: p.shop, products: [] });
    map.get(key)!.products.push(p);
  }
  return Array.from(map.values());
}

function ProductCard({ product, shopId }: { product: Product; shopId: string }) {
  const isUnavailable = !product.is_available || product.quantity === 0;
  const dietary = product.dietary_type ? DIETARY[product.dietary_type] : null;
  const finalPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  return (
    <Link
      href={`/shops/${shopId}`}
      className={`glass-card overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        product.discount > 0 ? 'ring-2 ring-accent/50' : ''
      } ${isUnavailable ? 'opacity-60' : ''}`}
    >
      {/* Image area */}
      <div className="relative w-full h-36 bg-surface overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-primary/5">
            <Package className="w-8 h-8 text-primary/20" />
            <span className="text-[10px] text-muted/40 font-medium uppercase tracking-wide">
              {product.category}
            </span>
          </div>
        )}
        {/* Sale ribbon */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            -{product.discount}%
          </div>
        )}
        {/* Dietary badge */}
        {dietary && (
          <div className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${dietary.pill}`}>
            {dietary.icon} {dietary.label}
          </div>
        )}
        {/* Unavailable overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-muted mt-0.5 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-primary">{finalPrice} EUR</span>
          {product.discount > 0 && (
            <span className="text-xs text-muted line-through">{product.price.toFixed(2)} EUR</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductsClient({ products }: { products: Product[] }) {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.shop?.name ?? '').toLowerCase().includes(q) ||
        (p.shop?.city ?? '').toLowerCase().includes(q);
      const matchesDietary =
        dietaryFilter === 'all' || p.dietary_type === dietaryFilter;
      return matchesSearch && matchesDietary;
    });
  }, [products, search, dietaryFilter]);

  const groups = useMemo(() => groupByShop(filtered), [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('user.productSearch')}</h1>
        <p className="text-muted mt-1">
          {filtered.length} {t('nav.products').toLowerCase()} — {groups.length} {t('nav.shops').toLowerCase()}
        </p>
      </div>

      {/* Search + dietary filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('user.searchProducts')}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        {/* Dietary filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              dietaryFilter === 'all'
                ? 'bg-primary text-white border-primary'
                : 'bg-surface border-border hover:bg-surface-hover'
            }`}
          >
            {t('user.allDietary')}
          </button>
          {(Object.entries(DIETARY) as [DietaryType, (typeof DIETARY)[DietaryType]][]).map(
            ([key, meta]) => (
              <button
                key={key}
                onClick={() => setDietaryFilter(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  dietaryFilter === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-border hover:bg-surface-hover'
                }`}
              >
                {meta.icon} {meta.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results */}
      {groups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-muted" />
          <p className="text-muted">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ shop, products: shopProducts }) => (
            <section key={shop.id}>
              {/* Shop header — clicking goes to shop page */}
              <Link
                href={`/shops/${shop.id}`}
                className="flex items-center gap-3 mb-4 group w-fit"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {shop.name}
                  </h2>
                  <p className="text-sm text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {shop.city || shop.address}
                    {shop.owner?.full_name && ` · ${shop.owner.full_name}`}
                  </p>
                </div>
              </Link>

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {shopProducts.map((product) => (
                  <ProductCard key={product.id} product={product} shopId={shop.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
