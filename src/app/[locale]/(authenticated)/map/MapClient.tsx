'use client';

import 'leaflet/dist/leaflet.css';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSyncExternalStore } from 'react';
import { Lock, MapPin, HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Shop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
}

export function MapClient({ shops, isPro }: { shops: Shop[]; isPro: boolean }) {
  const t = useTranslations();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Center of Germany
  const defaultCenter: [number, number] = [51.1657, 10.4515];
  const defaultZoom = isPro ? 6 : 5;

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-150 rounded-xl bg-surface border border-border flex items-center justify-center">
          <p className="text-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('map.title')}</h1>
          <p className="text-muted mt-1">{shops.length} {t('nav.shops')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg hover:bg-surface-hover cursor-help" title={t('help.tooltip')}>
            <HelpCircle className="w-5 h-5 text-muted" />
          </div>
        </div>
      </div>

      {!isPro && (
        <div className="mb-4 p-3 glass-card bg-accent/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-sm">{t('map.limitedView')}</span>
          </div>
          <Link href="/pricing" className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90">
            {t('common.upgrade')}
          </Link>
        </div>
      )}

      <div className="glass-card overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={isPro}
          zoomControl={isPro}
          dragging={isPro}
          doubleClickZoom={isPro}
          touchZoom={isPro}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {shops.map((shop) => (
            <Marker key={shop.id} position={[shop.latitude, shop.longitude]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold text-sm">{shop.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {shop.city || shop.address}
                  </p>
                  {isPro && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 block"
                    >
                      Get Directions
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
