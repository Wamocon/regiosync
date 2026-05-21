'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Store, Package, Star, MessageSquare, Plus, MapPin, HelpCircle, Trash2, Edit } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  is_active: boolean;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  discount: number;
  is_available: boolean;
}

interface ProductRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user: { full_name: string } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
}

interface Profile {
  id: string;
  full_name: string;
  is_pro: boolean;
}

export function SellerDashboardClient({
  profile,
  shops,
  requests,
  reviews,
}: {
  profile: Profile;
  shops: Shop[];
  requests: ProductRequest[];
  reviews: Review[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const supabase = createClient();

  const totalProducts = shops.reduce((sum, s) => sum + s.products.length, 0);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleDeleteShop = async (shopId: string) => {
    if (!confirm(t('admin.confirmDeleteShop'))) return;
    await supabase.from('shops').delete().eq('id', shopId);
    router.refresh();
  };

  const handleRequestAction = async (requestId: string, status: string) => {
    await supabase.from('product_requests').update({ status }).eq('id', requestId);
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('seller.dashboard')}</h1>
          <p className="text-muted mt-1">
            {profile.full_name} {profile.is_pro && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded ml-1">PRO</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(!showHelp)} className="p-2 rounded-lg hover:bg-surface-hover">
            <HelpCircle className="w-5 h-5 text-muted" />
          </button>
          <Link href="/seller/shops/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />
            {t('seller.createShop')}
          </Link>
        </div>
      </div>

      {showHelp && (
        <div className="mb-6 p-4 glass-card bg-primary/5">
          <p className="text-sm text-muted">{t('help.tooltip')}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Store className="w-5 h-5" />} label={t('seller.totalShops')} value={shops.length.toString()} />
        <StatCard icon={<Package className="w-5 h-5" />} label={t('seller.totalProducts')} value={totalProducts.toString()} />
        <StatCard icon={<Star className="w-5 h-5" />} label={t('seller.averageRating')} value={avgRating} />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label={t('seller.totalReviews')} value={reviews.length.toString()} />
      </div>

      {/* Shops */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{t('seller.myShops')}</h2>
        {shops.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Store className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">{t('seller.noShops')}</p>
            <Link href="/seller/shops/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium">
              <Plus className="w-4 h-4" />
              {t('seller.createShop')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop) => (
              <div key={shop.id} className="glass-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{shop.name}</h3>
                    <p className="text-sm text-muted flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {shop.city || shop.address}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/seller/shops/${shop.id}`} className="p-1.5 rounded-lg hover:bg-surface-hover text-muted">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDeleteShop(shop.id)} className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>{shop.products.length} {t('nav.products')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${shop.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                    {shop.is_active ? t('user.openNow') : t('user.closed')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t('seller.recentOrders')}</h2>
        {requests.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted">
            {t('common.noResults')}
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{req.title}</p>
                  <p className="text-xs text-muted">
                    {req.user?.full_name} - <span suppressHydrationWarning>{new Date(req.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestAction(req.id, 'accepted')}
                      className="px-3 py-1 text-xs bg-primary text-white rounded-lg"
                    >
                      {t('seller.accept')}
                    </button>
                    <button
                      onClick={() => handleRequestAction(req.id, 'rejected')}
                      className="px-3 py-1 text-xs border border-border rounded-lg"
                    >
                      {t('seller.reject')}
                    </button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {req.status === 'accepted' ? t('seller.accepted') : t('seller.rejected')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
