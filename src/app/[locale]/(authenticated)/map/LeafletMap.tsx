'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, X, Loader2, MapPin, Store, AlertCircle } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
}

interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

interface RouteData {
  coords: [number, number][];
  steps: RouteStep[];
  totalDistance: number;
  totalDuration: number;
}

// Custom div icon factory — shows shop name label
function createShopIcon(name: string, isSelected: boolean) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display:flex;flex-direction:column;align-items:center;cursor:pointer;
      ">
        <div style="
          background:${isSelected ? '#2563eb' : '#16a34a'};
          border:2px solid white;
          border-radius:50%;
          width:32px;height:32px;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          transition:all 0.2s;
        ">
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>
            <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'/>
            <line x1='3' y1='6' x2='21' y2='6'/>
            <path d='M16 10a4 4 0 0 1-8 0'/>
          </svg>
        </div>
        <div style="
          margin-top:2px;
          background:${isSelected ? '#2563eb' : '#1a1a1a'};
          color:white;
          font-size:10px;font-weight:600;
          padding:2px 6px;
          border-radius:4px;
          white-space:nowrap;
          max-width:120px;
          overflow:hidden;text-overflow:ellipsis;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
        ">${name}</div>
      </div>
    `,
    iconSize: [120, 52],
    iconAnchor: [60, 34],
    popupAnchor: [0, -34],
  });
}

// User location icon
const userIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:16px;height:16px;
      background:#3b82f6;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 3px rgba(59,130,246,0.4);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Fly-to controller — runs inside MapContainer
function MapController({
  routeCoords,
  userPos,
  selectedShop,
}: {
  routeCoords: [number, number][];
  userPos: [number, number] | null;
  selectedShop: Shop | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1.2 });
    } else if (selectedShop) {
      map.flyTo([selectedShop.latitude, selectedShop.longitude], 13, { animate: true, duration: 1 });
    }
  }, [routeCoords, selectedShop, userPos, map]);

  return null;
}

interface LeafletMapProps {
  shops: Shop[];
  isPro: boolean;
  t: (key: string) => string;
}

export function LeafletMap({ shops, isPro, t }: LeafletMapProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const defaultCenter: [number, number] = [51.1657, 10.4515];
  const defaultZoom = isPro ? 6 : 5;

  const requestDirections = async (shop: Shop) => {
    setRouteError(null);
    setLocating(true);
    setSelectedShop(shop);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLatLng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(userLatLng);
        setLocating(false);
        setRouteLoading(true);

        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${userLatLng[1]},${userLatLng[0]};${shop.longitude},${shop.latitude}?overview=full&geometries=geojson&steps=true`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Routing failed');
          const data = await res.json();

          if (!data.routes || data.routes.length === 0) throw new Error('No route found');

          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );

          const steps: RouteStep[] = route.legs[0]?.steps?.map((s: {
            maneuver: { instruction?: string; type: string; modifier?: string };
            distance: number;
            duration: number;
            name: string;
          }) => ({
            instruction: s.maneuver.instruction || `${s.maneuver.type} on ${s.name}`,
            distance: s.distance,
            duration: s.duration,
          })) ?? [];

          setRouteData({
            coords,
            steps,
            totalDistance: route.distance,
            totalDuration: route.duration,
          });
        } catch {
          setRouteError('Could not calculate route. Please try again.');
        } finally {
          setRouteLoading(false);
        }
      },
      () => {
        setLocating(false);
        setRouteError('Location access denied. Please enable GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearRoute = () => {
    setRouteData(null);
    setRouteError(null);
    setSelectedShop(null);
    setUserPos(null);
  };

  const formatDistance = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m} min`;
  };

  return (
    <div className="relative" style={{ height: '600px' }}>
      {/* Route info panel */}
      {(routeData || routeLoading || routeError || locating) && (
        <div className="absolute top-3 right-3 z-1000 w-72 glass-card shadow-xl rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">
                {selectedShop?.name ?? 'Route'}
              </span>
            </div>
            <button onClick={clearRoute} className="p-1 rounded hover:bg-surface-hover">
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>

          {(locating || routeLoading) && (
            <div className="p-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              <p className="text-sm text-muted">
                {locating ? 'Getting your location...' : 'Calculating route...'}
              </p>
            </div>
          )}

          {routeError && (
            <div className="p-4 flex items-start gap-2 text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-sm">{routeError}</p>
            </div>
          )}

          {routeData && !routeLoading && (
            <>
              <div className="p-3 flex gap-4 border-b border-border">
                <div className="text-center">
                  <p className="text-lg font-bold">{formatDistance(routeData.totalDistance)}</p>
                  <p className="text-xs text-muted">Distance</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{formatDuration(routeData.totalDuration)}</p>
                  <p className="text-xs text-muted">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{selectedShop?.city ?? ''}</p>
                  <p className="text-xs text-muted">Destination</p>
                </div>
              </div>
              <div className="overflow-y-auto max-h-56 divide-y divide-border">
                {routeData.steps.slice(0, 20).map((step, i) => (
                  <div key={i} className="px-3 py-2 flex items-start gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs">{step.instruction}</p>
                      <p className="text-[10px] text-muted">{formatDistance(step.distance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={5}
        maxZoom={isPro ? 18 : 12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={isPro}
        zoomControl={isPro}
        dragging={isPro}
        doubleClickZoom={isPro}
        touchZoom={isPro}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController routeCoords={routeData?.coords ?? []} userPos={userPos} selectedShop={selectedShop} />

        {/* Route polyline */}
        {routeData && (
          <Polyline
            positions={routeData.coords}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8, dashArray: undefined }}
          />
        )}

        {/* User location marker */}
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <div className="text-xs font-semibold p-1">Your location</div>
            </Popup>
          </Marker>
        )}

        {/* Shop markers */}
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.latitude, shop.longitude]}
            icon={createShopIcon(shop.name, selectedShop?.id === shop.id)}
            ref={(marker) => {
              if (marker) markersRef.current.set(shop.id, marker);
            }}
          >
            <Popup>
              <div className="p-1 min-w-40">
                <div className="flex items-center gap-1.5 mb-1">
                  <Store className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <h3 className="font-bold text-sm leading-tight">{shop.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{shop.city || shop.address}</span>
                </div>
                {isPro && (
                  <button
                    onClick={() => requestDirections(shop)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    Get Directions
                  </button>
                )}
                {!isPro && (
                  <p className="text-[10px] text-gray-400 italic">Upgrade to Pro for directions</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
