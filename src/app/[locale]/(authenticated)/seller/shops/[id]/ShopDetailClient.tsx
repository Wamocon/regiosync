'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Plus, Trash2, Package, HelpCircle, Edit, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

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

type FormMode = 'add' | 'edit';

export function ShopDetailClient({ shop }: { shop: Shop }) {
  const t = useTranslations();
  const router = useRouter();
  const supabase = createClient();

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [category, setCategory] = useState('other');
  const [discount, setDiscount] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = ['fruits', 'vegetables', 'dairy', 'meat', 'bakery', 'honey', 'eggs', 'herbs', 'drinks', 'other'];

  const resetForm = () => {
    setName(''); setDesc(''); setPrice(''); setQty('');
    setCategory('other'); setDiscount('0');
    setImageFile(null); setImagePreview(null);
    setEditingProductId(null); setShowForm(false);
  };

  const openAddForm = () => { resetForm(); setFormMode('add'); setShowForm(true); };

  const openEditForm = (product: Product) => {
    setFormMode('edit');
    setEditingProductId(product.id);
    setName(product.name);
    setDesc(product.description ?? '');
    setPrice(product.price.toString());
    setQty(product.quantity.toString());
    setCategory(product.category);
    setDiscount(product.discount.toString());
    setImagePreview(product.image_url);
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const ext = imageFile.name.split('.').pop();
    const path = `products/${shop.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile, { upsert: true });
    if (error) return null;
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const qtyNum = parseInt(qty) || 0;
    let imageUrl: string | null = null;
    if (imageFile) imageUrl = await uploadImage();

    const payload = {
      name, description: desc,
      price: parseFloat(price),
      quantity: qtyNum,
      category,
      discount: parseInt(discount) || 0,
      is_available: qtyNum > 0,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    };

    if (formMode === 'add') {
      await supabase.from('products').insert({ shop_id: shop.id, ...payload });
    } else if (editingProductId) {
      await supabase.from('products').update(payload).eq('id', editingProductId);
    }
    resetForm(); setLoading(false); router.refresh();
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

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{shop.name}</h1>
          <p className="text-muted mt-1">{shop.description}</p>
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded-lg hover:bg-surface-hover cursor-help" title={t('help.pages.shopManage')}>
            <HelpCircle className="w-5 h-5 text-muted" />
          </div>
          <button onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4 shrink-0" />
            {t('seller.addProduct')}
          </button>
        </div>
      </div>

      {/* Add / Edit Product Form */}
      {showForm && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {formMode === 'add' ? t('seller.addProduct') : t('seller.editProduct')}
            </h2>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-surface-hover">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productName')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productCategory')}</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{t(`seller.categories.${cat}` as 'seller.categories.fruits')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('seller.productDescription')}</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productPrice')} (EUR)</label>
                <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.productQuantity')}</label>
                <input type="number" min="0" value={qty} onChange={e => setQty(e.target.value)} className={inputCls} required />
                {qty !== '' && parseInt(qty) === 0 && (
                  <p className="text-xs text-orange-500 mt-1">Qty 0 marks product as Unavailable</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('seller.discount')} (%)</label>
                <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} className={inputCls} />
              </div>
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">{t('seller.productImage')}</label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized={imagePreview.startsWith('data:')} />
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
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
                    {imageFile ? imageFile.name : 'Click to upload image (optional)'}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium disabled:opacity-50">
                {loading ? t('common.loading') : formMode === 'add' ? t('seller.addProduct') : t('common.save')}
              </button>
              <button type="button" onClick={resetForm}
                className="px-6 py-2.5 border border-border rounded-xl hover:bg-surface-hover transition-all text-sm">
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
          {shop.products.map((product) => {
            const isUnavailable = !product.is_available || product.quantity === 0;
            return (
              <div key={product.id} className={`glass-card overflow-hidden ${isUnavailable ? 'opacity-70' : ''}`}>
                {product.image_url && (
                  <div className="relative w-full h-36">
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-xs text-muted capitalize mt-0.5">
                        {t(`seller.categories.${product.category}` as 'seller.categories.fruits')}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-2">
                      <button onClick={() => openEditForm(product)}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {product.description && (
                    <p className="text-xs text-muted mt-1.5 line-clamp-2">{product.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {product.discount > 0
                          ? (product.price * (1 - product.discount / 100)).toFixed(2)
                          : product.price.toFixed(2)} EUR
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-xs text-muted line-through">{product.price.toFixed(2)} EUR</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded">-{product.discount}%</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-muted">Qty: {product.quantity}</span>
                  </div>
                  <button
                    onClick={() => handleToggleAvailability(product.id, product.is_available)}
                    className={`mt-2 px-3 py-1 text-xs rounded-full transition-colors ${
                      isUnavailable
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {isUnavailable ? 'Unavailable' : 'Available'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}