'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Star, MapPin, Package, Send, Lock, HelpCircle, MessageSquare } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  discount: number;
  is_available: boolean;
  image_url: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: { full_name: string } | null;
}

interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  owner: { full_name: string; email: string } | null;
  products: Product[];
  reviews: Review[];
}

export function ShopViewClient({ shop, userId, isPro }: { shop: Shop; userId: string; isPro: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const supabase = createClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const avgRating = shop.reviews.length > 0
    ? (shop.reviews.reduce((sum, r) => sum + r.rating, 0) / shop.reviews.length).toFixed(1)
    : null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('reviews').insert({
      user_id: userId,
      shop_id: shop.id,
      rating,
      comment,
    });
    // Notify the shop owner about the new review
    if (shop.owner_id && shop.owner_id !== userId) {
      await supabase.from('notifications').insert({
        user_id: shop.owner_id,
        type: 'review',
        title: t('notifications.newReview'),
        message: comment,
      });
    }
    setComment('');
    setShowReviewForm(false);
    setLoading(false);
    router.refresh();
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('product_requests').insert({
      user_id: userId,
      shop_id: shop.id,
      title: requestTitle,
      description: requestDesc,
    });
    // Notify the shop owner about the product request
    if (shop.owner_id && shop.owner_id !== userId) {
      await supabase.from('notifications').insert({
        user_id: shop.owner_id,
        type: 'product_request',
        title: t('notifications.productRequest'),
        message: requestTitle,
      });
    }
    setRequestTitle('');
    setRequestDesc('');
    setShowRequestForm(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Shop Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <p className="text-muted mt-1">{shop.owner?.full_name}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {shop.city || shop.address}, {shop.country}
              </span>
              {avgRating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  {avgRating} ({shop.reviews.length})
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 rounded-lg hover:bg-surface-hover cursor-help" title={t('help.tooltip')}>
              <HelpCircle className="w-5 h-5 text-muted" />
            </div>
            {isPro ? (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                {t('user.directions')}
              </a>
            ) : (
              <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm text-muted">
                <Lock className="w-4 h-4" />
                {t('user.directions')}
              </Link>
            )}
          </div>
        </div>
        {shop.description && (
          <p className="mt-4 text-muted">{shop.description}</p>
        )}
      </div>

      {/* Products */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('user.allProducts')} ({shop.products.filter(p => p.is_available).length})</h2>
          <button
            onClick={() => setShowRequestForm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-surface-hover transition-all text-sm"
          >
            <Send className="w-4 h-4" />
            {t('user.requestProduct')}
          </button>
        </div>

        {shop.products.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted">
            <Package className="w-12 h-12 mx-auto mb-3 text-muted" />
            <p>{t('seller.noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shop.products.filter(p => p.is_available).map((product) => (
              <div key={product.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-xs text-muted capitalize">{t(`seller.categories.${product.category}` as 'seller.categories.fruits')}</p>
                  </div>
                  {product.discount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded">-{product.discount}%</span>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-muted mt-2 line-clamp-2">{product.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {product.discount > 0
                        ? (product.price * (1 - product.discount / 100)).toFixed(2)
                        : product.price.toFixed(2)
                      } EUR
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-muted line-through">{product.price.toFixed(2)} EUR</span>
                    )}
                  </div>
                  <span className="text-xs text-muted">{product.quantity} available</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Request Form */}
      {showRequestForm && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{t('user.requestTitle')}</h3>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('user.requestTitle')}</label>
              <input
                type="text"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('user.requestDesc')}</label>
              <textarea
                value={requestDesc}
                onChange={(e) => setRequestDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark text-sm font-medium disabled:opacity-50">
                {t('common.submit')}
              </button>
              <button type="button" onClick={() => setShowRequestForm(false)} className="px-6 py-2.5 border border-border rounded-xl text-sm">
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('user.reviews')} ({shop.reviews.length})</h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            {t('user.writeReview')}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="glass-card p-6 mb-4">
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('user.rating')}</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('user.reviewText')}</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark text-sm font-medium disabled:opacity-50">
                  {t('user.submitReview')}
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2.5 border border-border rounded-xl text-sm">
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {shop.reviews.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted">
            <p>{t('user.noReviews')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shop.reviews.map((review) => (
              <div key={review.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{review.user?.full_name}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-muted">{review.comment}</p>}
                <p className="text-xs text-muted mt-2" suppressHydrationWarning>{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
