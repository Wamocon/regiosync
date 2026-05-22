'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Clock, Save, ToggleLeft, ToggleRight, AlertCircle, CalendarDays } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ShopHour {
  id?: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface ShopOverride {
  id: string;
  status: 'open' | 'closed';
  until: string;
}

interface ShopHoursManagerProps {
  shopId: string;
  initialHours: ShopHour[];
  activeOverride: ShopOverride | null;
}

const OVERRIDE_PRESETS = [
  { label: '1 hour', hours: 1 },
  { label: '4 hours', hours: 4 },
  { label: '8 hours', hours: 8 },
  { label: '1 day', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '1 week', hours: 168 },
];

export function ShopHoursManager({ shopId, initialHours, activeOverride }: ShopHoursManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  // Build a full 7-day schedule from the DB data
  const buildSchedule = () =>
    Array.from({ length: 7 }, (_, i) => {
      const existing = initialHours.find((h) => h.day_of_week === i);
      return existing ?? { day_of_week: i, open_time: '09:00', close_time: '18:00', is_closed: false };
    });

  const [schedule, setSchedule] = useState<ShopHour[]>(buildSchedule);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [override, setOverride] = useState<ShopOverride | null>(activeOverride);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [showOverridePanel, setShowOverridePanel] = useState(false);
  const [customUntil, setCustomUntil] = useState('');

  const updateDay = (idx: number, field: keyof ShopHour, value: string | boolean) => {
    setSchedule((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const saveSchedule = async () => {
    setSaving(true);
    for (const day of schedule) {
      await supabase.from('shop_hours').upsert(
        {
          shop_id: shopId,
          day_of_week: day.day_of_week,
          open_time: day.is_closed ? null : day.open_time,
          close_time: day.is_closed ? null : day.close_time,
          is_closed: day.is_closed,
        },
        { onConflict: 'shop_id,day_of_week' }
      );
    }
    setSaving(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2000);
    router.refresh();
  };

  const applyOverride = async (status: 'open' | 'closed', untilIso: string) => {
    setOverrideLoading(true);
    // Remove any existing override for this shop
    await supabase.from('shop_overrides').delete().eq('shop_id', shopId);
    const { data } = await supabase
      .from('shop_overrides')
      .insert({ shop_id: shopId, status, until: untilIso })
      .select()
      .single();
    setOverride(data as ShopOverride);
    setOverrideLoading(false);
    setShowOverridePanel(false);
    router.refresh();
  };

  const clearOverride = async () => {
    setOverrideLoading(true);
    await supabase.from('shop_overrides').delete().eq('shop_id', shopId);
    setOverride(null);
    setOverrideLoading(false);
    router.refresh();
  };

  const addHours = (h: number) => new Date(Date.now() + h * 3600 * 1000).toISOString();

  const formatUntil = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">Opening Hours</h2>
        <span className="text-xs text-muted">(automatic open/close)</span>
      </div>

      {/* Active Override Banner */}
      {override && new Date(override.until) > new Date() && (
        <div className={`flex items-center justify-between p-3 mb-5 rounded-xl text-sm ${
          override.status === 'closed'
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Manual override active:</strong> Shop is {override.status} until {formatUntil(override.until)}
            </span>
          </div>
          <button
            onClick={clearOverride}
            disabled={overrideLoading}
            className="ml-4 px-3 py-1 text-xs rounded-lg border border-current hover:bg-black/5 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="space-y-2 mb-6">
        {schedule.map((day, idx) => (
          <div key={day.day_of_week} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
            <span className="w-24 text-sm font-medium shrink-0">{DAYS[day.day_of_week]}</span>

            {/* Toggle closed */}
            <button
              onClick={() => updateDay(idx, 'is_closed', !day.is_closed)}
              className="shrink-0"
              title={day.is_closed ? 'Click to mark as open' : 'Click to mark as closed'}
            >
              {day.is_closed
                ? <ToggleLeft className="w-8 h-8 text-muted" />
                : <ToggleRight className="w-8 h-8 text-primary" />}
            </button>

            {day.is_closed ? (
              <span className="text-sm text-muted italic">Closed</span>
            ) : (
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                <input
                  type="time"
                  value={day.open_time ?? '09:00'}
                  onChange={(e) => updateDay(idx, 'open_time', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-xs text-muted">to</span>
                <input
                  type="time"
                  value={day.close_time ?? '18:00'}
                  onChange={(e) => updateDay(idx, 'close_time', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Schedule */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={saveSchedule}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : savedOk ? 'Saved!' : 'Save Schedule'}
        </button>
        <span className="text-xs text-muted">The app will automatically show open/closed based on this schedule.</span>
      </div>

      {/* Manual Override */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary" />
              Manual Override
            </h3>
            <p className="text-xs text-muted mt-0.5">Temporarily force open or closed for a set duration</p>
          </div>
          <button
            onClick={() => setShowOverridePanel(!showOverridePanel)}
            className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-surface-hover transition-colors"
          >
            {showOverridePanel ? 'Cancel' : 'Set Override'}
          </button>
        </div>

        {showOverridePanel && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            {/* Close shop temporarily */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Close shop for…</p>
              <div className="flex flex-wrap gap-2">
                {OVERRIDE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyOverride('closed', addHours(p.hours))}
                    disabled={overrideLoading}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-700 dark:border-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Force open temporarily */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Force open for…</p>
              <div className="flex flex-wrap gap-2">
                {OVERRIDE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyOverride('open', addHours(p.hours))}
                    disabled={overrideLoading}
                    className="px-3 py-1.5 text-xs rounded-lg border border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom datetime */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Custom until date & time</p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="datetime-local"
                  value={customUntil}
                  onChange={(e) => setCustomUntil(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={() => customUntil && applyOverride('closed', new Date(customUntil).toISOString())}
                  disabled={!customUntil || overrideLoading}
                  className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-700 dark:border-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                >
                  Close until this time
                </button>
                <button
                  onClick={() => customUntil && applyOverride('open', new Date(customUntil).toISOString())}
                  disabled={!customUntil || overrideLoading}
                  className="px-3 py-1.5 text-xs rounded-lg border border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40"
                >
                  Open until this time
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
