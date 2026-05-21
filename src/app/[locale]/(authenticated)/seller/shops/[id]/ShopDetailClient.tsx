'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Plus, Trash2, Package, HelpCircle } from 'lucide-react';

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

interface Shop {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export function ShopDetailClient({ shop }: { shop: Shop }) {
  const t = useTranslations();
  const router = useRouter();
  const supabase = createClient();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQty, setProductQty] = useState('');
  const [productCategory, setProductCategory] = useState('other');
  const [productDiscount, setProductDiscount] = useState('0');
  const [loading, setLoading] = useState(false);

  const categories = ['fruits', 'vegetables', 'dairy', 'meat', 'bakery', 'honey', 'eggs', 'herbs', 'drinks', 'other'];

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from('products').insert({
      shop_id: shop.id,
      name: productName,
      description: productDesc,
      price: parseFloat(productPrice),
      quantity: parseInt(productQty),
      category: productCategory,
      discount: parseInt(productDiscount),
    });

    setProductName('');
    setProductDesc('');
    setProductPrice('');
    setProductQty('');
    setProductCategory('other');
    setProductDiscount('0');
    setShowAddProduct(false);
    setLoading(false);
    router.refresh();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('admin.confirmDeleteProduct'))) return;
    await supabase.from('products').delete().eq('id', productId);
    router.refresh();
  };

  const handleToggleAvailability = async (productId: string, current: boolean) => {
    await supabase.from('products').update({ is_available: !current }).eq('id', productId);
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{shop.name}</h1>
          <p className="text-muted mt-1">{shop.description}</p>
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded-lg hover:bg-surface-hover cursor-help" title={t('help.tooltip')}>
            <HelpCircle className="w-5 h-5 text-muted" />
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {t('seller.addProduct')}
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddProduct && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">{t('seller.addProduct')}</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productName')}</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productCategory')}</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {t(`seller.categories.${cat}` as 'seller.categories.fruits')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('seller.productDescription')}</label>
              <textarea
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productPrice')} (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productQuantity')}</label>
                <input
                  type="number"
                  min="0"
                  value={productQty}
                  onChange={(e) => setProductQty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.discount')}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={productDiscount}
                  onChange={(e) => setProductDiscount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('seller.addProduct')}
              </button>
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className="px-6 py-2.5 border border-border rounded-xl hover:bg-surface-hover transition-all text-sm"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <h2 className="text-xl font-bold mb-4">{t('nav.products')} ({shop.products.length})</h2>
      {shop.products.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Package className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted">{t('seller.noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shop.products.map((product) => (
            <div key={product.id} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-xs text-muted capitalize mt-0.5">
                    {t(`seller.categories.${product.category}` as 'seller.categories.fruits')}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
                  {product.discount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded">-{product.discount}%</span>
                  )}
                </div>
                <span className="text-xs text-muted">Qty: {product.quantity}</span>
              </div>
              <button
                onClick={() => handleToggleAvailability(product.id, product.is_available)}
                className={`mt-2 px-3 py-1 text-xs rounded-full ${
                  product.is_available
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {product.is_available ? 'Available' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
