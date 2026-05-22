'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Store, Package, Star, MessageSquare, Plus, MapPin, Trash2, Edit, X, Save, Image as ImageIcon, ToggleLeft, ToggleRight, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { HelpButton } from '@/components/ui/HelpButton';
import Image from 'next/image';

interface Shop {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postal_code: string | null;
  house_number: string | null;
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
  shop_id: string;
  user: { full_name: string } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  shop_id: string;
  created_at: string;
  user: { full_name: string } | null;
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
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');
  const [editHouseNumber, setEditHouseNumber] = useState('');
  const [editLat, setEditLat] = useState<number | null>(null);
  const [editLng, setEditLng] = useState<number | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [openReviewShopId, setOpenReviewShopId] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const supabase = createClient();

  const totalProducts = shops.reduce((sum, s) => sum + s.products.length, 0);

  // Per-shop average rating
  function shopAvgRating(shopId: string): string | null {
    const shopReviews = reviews.filter(r => r.shop_id === shopId);
    if (shopReviews.length === 0) return null;
    return (shopReviews.reduce((s, r) => s + r.rating, 0) / shopReviews.length).toFixed(1);
  }

  const handleDeleteShop = async (shopId: string) => {
    if (!confirm(t('admin.confirmDeleteShop'))) return;
    await supabase.from('shops').delete().eq('id', shopId);
    router.refresh();
  };

  const handleRequestAction = async (requestId: string, status: string) => {
    await supabase.from('product_requests').update({ status }).eq('id', requestId);
    router.refresh();
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEditImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadShopImage = async (shopId: string): Promise<string | null> => {
    if (!editImageFile) return null;
    const ext = editImageFile.name.split('.').pop();
    const path = `shops/${shopId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('shop-images').upload(path, editImageFile, { upsert: true });
    if (error) return null;
    const { data: urlData } = supabase.storage.from('shop-images').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleToggleShopStatus = async (shop: Shop) => {
    await supabase.from('shops').update({ is_active: !shop.is_active }).eq('id', shop.id);
    router.refresh();
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEditLat(pos.coords.latitude);
        setEditLng(pos.coords.longitude);
        setGettingLocation(false);
      },
      () => setGettingLocation(false)
    );
  };

  const openEditShop = (shop: Shop) => {
    setEditingShop(shop);
    setEditName(shop.name);
    setEditDesc(shop.description);
    setEditAddress(shop.address);
    setEditCity(shop.city);
    setEditPostalCode(shop.postal_code ?? '');
    setEditHouseNumber(shop.house_number ?? '');
    setEditLat(shop.latitude);
    setEditLng(shop.longitude);
    setEditImageFile(null);
    setEditImagePreview(shop.image_url);
  };

  const handleSaveShop = async () => {
    if (!editingShop) return;
    setEditLoading(true);
    let imageUrl: string | null | undefined = undefined;
    if (editImageFile) {
      imageUrl = await uploadShopImage(editingShop.id);
    }
    await supabase.from('shops').update({
      name: editName,
      description: editDesc,
      address: editAddress,
      city: editCity,
      postal_code: editPostalCode || null,
      house_number: editHouseNumber || null,
      ...(editLat !== null && editLng !== null ? { latitude: editLat, longitude: editLng } : {}),
      ...(typeof imageUrl === 'string' ? { image_url: imageUrl } : {}),
    }).eq('id', editingShop.id);
    setEditLoading(false);
    setEditingShop(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditPostalCode('');
    setEditHouseNumber('');
    setEditLat(null);
    setEditLng(null);
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Edit Shop Modal */}
      {editingShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{t('seller.editShop')}</h2>
              <button onClick={() => setEditingShop(null)} className="p-1.5 rounded-lg hover:bg-surface-hover">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Shop image upload */}
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.shopImage')}</label>
                <div className="flex items-start gap-3">
                  {editImagePreview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0">
                      <Image src={editImagePreview} alt="Shop" fill className="object-cover" unoptimized={editImagePreview.startsWith('data:')} />
                      <button type="button" onClick={() => { setEditImagePreview(null); setEditImageFile(null); }}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 bg-surface">
                      <ImageIcon className="w-6 h-6 text-muted" />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors text-sm text-center text-muted">
                      {editImageFile ? editImageFile.name : t('seller.uploadShopImage')}
                    </div>
                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.shopName')}</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.shopDescription')}</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('seller.address')}</label>
                  <input value={editAddress} onChange={e => setEditAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('seller.city')}</label>
                  <input value={editCity} onChange={e => setEditCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('seller.houseNumber')}</label>
                  <input value={editHouseNumber} onChange={e => setEditHouseNumber(e.target.value)}
                    placeholder="e.g. 12a"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('seller.postalCode')}</label>
                  <input value={editPostalCode} onChange={e => setEditPostalCode(e.target.value)}
                    placeholder="e.g. 80331"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
              </div>
              {/* GPS location */}
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.shopLocation')}</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleGetLocation} disabled={gettingLocation}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors text-sm disabled:opacity-50">
                    <Navigation className="w-4 h-4 text-primary" />
                    {gettingLocation ? t('seller.geolocationNotSupported') : t('seller.useGPS')}
                  </button>
                  {editLat !== null && editLng !== null && (
                    <span className="text-xs text-muted font-mono">
                      {editLat.toFixed(5)}, {editLng.toFixed(5)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSaveShop} disabled={editLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium disabled:opacity-50">
                <Save className="w-4 h-4" />
                {editLoading ? t('common.loading') : t('common.save')}
              </button>
              <button onClick={() => setEditingShop(null)}
                className="px-5 py-2.5 border border-border rounded-xl hover:bg-surface-hover transition-all text-sm">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.dashboard')}</h1>
          <p className="text-muted mt-1">
            {profile.full_name} {profile.is_pro && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded ml-1">PRO</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HelpButton content={t('help.pages.dashboard')} />
          <Link href="/seller/shops/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />
            {t('seller.createShop')}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <StatCard icon={<Store className="w-5 h-5" />} label={t('seller.totalShops')} value={shops.length.toString()} />
        </div>
        <div>
          <StatCard icon={<Package className="w-5 h-5" />} label={t('seller.totalProducts')} value={totalProducts.toString()} />
        </div>
        <div>
          <StatCard icon={<MessageSquare className="w-5 h-5" />} label={t('seller.totalReviews')} value={reviews.length.toString()} />
        </div>
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
              <div key={shop.id} className="glass-card overflow-hidden flex flex-col">
                {/* Shop image */}
                {shop.image_url ? (
                  <div className="relative w-full h-36">
                    <Image src={shop.image_url} alt={shop.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-28 bg-primary/5 flex items-center justify-center">
                    <Store className="w-8 h-8 text-primary/30" />
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1 gap-3">
                  {/* Name + actions */}
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{shop.name}</h3>
                      <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {shop.city || shop.address}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-2">
                      <button onClick={() => openEditShop(shop)} className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-primary transition-colors" title={t('seller.editShop')}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteShop(shop.id)} className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-red-500 transition-colors" title={t('seller.deleteShop')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status toggle + products count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{shop.products.length} {t('nav.products')}</span>
                      {(() => {
                        const rating = shopAvgRating(shop.id);
                        return rating ? (
                          <span className="flex items-center gap-0.5 text-xs text-accent font-medium">
                            <Star className="w-3 h-3 fill-accent" />
                            {rating}
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <button
                      onClick={() => handleToggleShopStatus(shop)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        shop.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                      title={t('seller.toggleStatus')}
                    >
                      {shop.is_active
                        ? <><ToggleRight className="w-3.5 h-3.5" />{t('user.openNow')}</>
                        : <><ToggleLeft className="w-3.5 h-3.5" />{t('user.closed')}</>}
                    </button>
                  </div>

                  {/* Manage Products link */}
                  <Link
                    href={`/seller/shops/${shop.id}`}
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    <Package className="w-4 h-4" />
                    {t('nav.products')} &amp; {t('seller.editProduct')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requests grouped by shop */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t('seller.recentOrders')}</h2>
        {requests.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted">
            {t('common.noResults')}
          </div>
        ) : (
          shops.map((shop) => {
            const shopRequests = requests.filter(r => r.shop_id === shop.id);
            if (shopRequests.length === 0) return null;
            return (
              <div key={shop.id} className="mb-6">
                <h3 className="text-sm font-semibold text-muted mb-2 flex items-center gap-1.5">
                  <Store className="w-4 h-4" />{shop.name}
                </h3>
                <div className="space-y-3">
                  {shopRequests.map((req) => (
                    <div key={req.id} className="glass-card p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{req.title}</p>
                        <p className="text-xs text-muted">
                          {req.user?.full_name} &middot; <span suppressHydrationWarning>{new Date(req.created_at).toLocaleDateString()}</span>
                        </p>
                      </div>
                      {req.status === 'pending' ? (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleRequestAction(req.id, 'accepted')}
                            className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            {t('seller.accept')}
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, 'rejected')}
                            className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-surface-hover transition-colors"
                          >
                            {t('seller.reject')}
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs shrink-0 ${
                          req.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {req.status === 'accepted' ? t('seller.accepted') : t('seller.rejected')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Reviews section - collapsible per shop */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">{t('seller.shopReviews')}</h2>
        {reviews.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted">
            {t('seller.noReviews')}
          </div>
        ) : (
          shops.map((shop) => {
            const shopReviews = reviews.filter(r => r.shop_id === shop.id);
            if (shopReviews.length === 0) return null;
            const avg = (shopReviews.reduce((s, r) => s + r.rating, 0) / shopReviews.length).toFixed(1);
            const isOpen = openReviewShopId === shop.id;
            return (
              <div key={shop.id} className="mb-4">
                <button
                  type="button"
                  onClick={() => setOpenReviewShopId(isOpen ? null : shop.id)}
                  className="w-full flex items-center justify-between px-4 py-3 glass-card hover:bg-surface-hover transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Store className="w-4 h-4" />{shop.name}
                    <span className="flex items-center gap-0.5 text-accent">
                      <Star className="w-3.5 h-3.5 fill-accent" />{avg}
                    </span>
                    <span className="text-muted font-normal">({shopReviews.length})</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                </button>
                {isOpen && (
                  <div className="space-y-3 mt-2">
                    {shopReviews.map((review) => (
                      <div key={review.id} className="glass-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{review.user?.full_name ?? 'Anonymous'}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-accent text-accent' : 'text-border'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted shrink-0" suppressHydrationWarning>
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted mt-2">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-4 h-full">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
