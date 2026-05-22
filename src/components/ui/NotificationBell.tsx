'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
  link: string | null;
}

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('id, type, title, message, is_read, created_at, link')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    setNotifications(data ?? []);
    setLoading(false);
  };

  // Fetch on mount + subscribe to realtime inserts
  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (!ids.length) return;
    await supabase.from('notifications').update({ is_read: true }).in('id', ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const typeIcon = (type: string) => {
    const map: Record<string, string> = {
      review: '⭐',
      product_request: '📦',
      new_product: '🛍️',
      discount: '🏷️',
      back_in_stock: '✅',
      shop_open: '🟢',
      shop_closed: '🔴',
    };
    return map[type] ?? '🔔';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-muted" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background border border-border rounded-2xl shadow-2xl z-1000 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-primary transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-hover text-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border/50">
            {loading ? (
              <div className="py-8 text-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-10 h-10 text-muted/40 mx-auto mb-2" />
                <p className="text-sm text-muted">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`relative flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                  <div className="min-w-0 flex-1">
                    {n.link ? (
                      <Link
                        href={n.link as Parameters<typeof Link>[0]['href']}
                        className="block"
                        onClick={() => { markRead(n.id); setOpen(false); router.refresh(); }}
                      >
                        <p className={`text-sm leading-snug ${!n.is_read ? 'font-semibold' : 'font-medium'}`}>{n.title}</p>
                        {n.message && <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.message}</p>}
                        <p className="text-[11px] text-muted mt-1" suppressHydrationWarning>{timeAgo(n.created_at)}</p>
                      </Link>
                    ) : (
                      <div>
                        <p className={`text-sm leading-snug ${!n.is_read ? 'font-semibold' : 'font-medium'}`}>{n.title}</p>
                        {n.message && <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.message}</p>}
                        <p className="text-[11px] text-muted mt-1" suppressHydrationWarning>{timeAgo(n.created_at)}</p>
                      </div>
                    )}
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="shrink-0 p-1 rounded hover:bg-surface-hover text-primary"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!n.is_read && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-surface text-center">
            <Link
              href="/notifications"
              className="text-xs text-primary font-medium hover:underline"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
