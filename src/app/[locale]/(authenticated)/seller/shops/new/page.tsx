'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { MapPin, Navigation, Store, HelpCircle, Search } from 'lucide-react';

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
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

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
    const streetParts = [addr.house_number, addr.road].filter(Boolean).join(' ');
    setAddress(streetParts || result.display_name.split(',')[0]);
    const cityValue = addr.city || addr.town || addr.village || addr.municipality || '';
    setCity(cityValue);
    setLatitude(result.lat);
    setLongitude(result.lon);
    setShowSuggestions(false);
    setAddressSuggestions([]);
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

    const { error: insertError } = await supabase.from('shops').insert({
      owner_id: user.id,
      name,
      description,
      address,
      city,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/seller/dashboard');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('seller.createShop')}</h1>
        <div className="p-2 rounded-lg hover:bg-surface-hover cursor-help" title={t('help.tooltip')}>
          <HelpCircle className="w-5 h-5 text-muted" />
        </div>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5">Address</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                {addressSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Start typing an address..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  autoComplete="off"
                />
              </div>
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                  {addressSuggestions.map((result) => (
                    <button
                      key={result.place_id}
                      type="button"
                      onClick={() => selectSuggestion(result)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface-hover transition-colors border-b border-border/50 last:border-0 truncate"
                    >
                      {result.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
