'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { MapPin, Navigation, Store, Search, X, Image as ImageIcon } from 'lucide-react';
import { HelpButton } from '@/components/ui/HelpButton';
import Image from 'next/image';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export default function NewShopPage() {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressSearching, setAddressSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) { setAddressSuggestions([]); setShowSuggestions(false); return; }
    setAddressSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'de,en' } }
      );
      const data: NominatimResult[] = await res.json();
      setAddressSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setAddressSuggestions([]);
    } finally {
      setAddressSearching(false);
    }
  }, []);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(value), 400);
  };

  const selectSuggestion = (result: NominatimResult) => {
    const addr = result.address;
    setAddress(addr.road ?? result.display_name.split(',')[0]);
    setHouseNumber(addr.house_number ?? '');
    setPostalCode(addr.postcode ?? '');
    const cityValue = addr.city || addr.town || addr.village || addr.municipality || '';
    setCity(cityValue);
    setLatitude(result.lat);
    setLongitude(result.lon);
    setShowSuggestions(false);
    setAddressSuggestions([]);
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

  const uploadShopImage = async (shopId: string): Promise<string | null> => {
    if (!imageFile) return null;
    const supabase = createClient();
    const ext = imageFile.name.split('.').pop();
    const path = `shops/${shopId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('shop-images').upload(path, imageFile, { upsert: true });
    if (error) return null;
    const { data: urlData } = supabase.storage.from('shop-images').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
        setGpsLoading(false);
      },
      (err) => {
        setError(err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Insert shop first to get its ID, then upload image
    const fullAddress = [address, houseNumber].filter(Boolean).join(' ');
    const { data: shopData, error: insertError } = await supabase.from('shops').insert({
      owner_id: user.id,
      name,
      description,
      address: fullAddress,
      city: [postalCode, city].filter(Boolean).join(' '),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    }).select('id').single();

    if (insertError || !shopData) {
      setError(insertError?.message ?? 'Failed to create shop');
      setLoading(false);
      return;
    }

    // Upload shop image if provided
    if (imageFile) {
      const imageUrl = await uploadShopImage(shopData.id);
      if (imageUrl) {
        await supabase.from('shops').update({ image_url: imageUrl }).eq('id', shopData.id);
      }
    }

    router.push('/seller/dashboard');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('seller.createShop')}</h1>
        <HelpButton content={t('help.pages.newShop')} />
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Shop Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('seller.shopImage')}</label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border shrink-0">
                  <Image src={imagePreview} alt="Shop preview" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 bg-surface">
                  <ImageIcon className="w-7 h-7 text-muted" />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors text-sm text-center text-muted">
                  {imageFile ? imageFile.name : 'Click to upload shop image (optional)'}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('seller.shopName')}</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('seller.shopDescription')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Address search — full width so dropdown is never clipped */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Street / Road</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              {addressSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              <input
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Start typing a street or address…"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoComplete="off"
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-999 bg-background border border-border rounded-xl shadow-xl overflow-y-auto max-h-64">
                  {addressSuggestions.map((result) => (
                    <button
                      key={result.place_id}
                      type="button"
                      onMouseDown={() => selectSuggestion(result)}
                      className="w-full px-4 py-3 text-left hover:bg-surface-hover transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="text-sm font-medium text-foreground leading-snug">
                        {[result.address?.road, result.address?.house_number].filter(Boolean).join(' ') || result.display_name.split(',')[0]}
                      </div>
                      <div className="text-xs text-muted mt-0.5 line-clamp-1">{result.display_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* House number, postal code, city */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">House No.</label>
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="12a"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="78532"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Tuttlingen"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('seller.shopLocation')}</label>
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={gpsLoading}
              className="mb-3 flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-xl hover:bg-secondary/20 transition-all text-sm font-medium"
            >
              <Navigation className="w-4 h-4" />
              {gpsLoading ? t('common.loading') : t('seller.useGPS')}
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Latitude</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Longitude</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('seller.createShop')}
          </button>
        </form>
      </div>
    </div>
  );
}
