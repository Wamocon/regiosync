'use client';

import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Bell, Check } from 'lucide-react';
import { HelpButton } from '@/components/ui/HelpButton';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export function NotificationsClient({ notifications }: { notifications: Notification[] }) {
  const t = useTranslations();
  const router = useRouter();
  const supabase = createClient();

  const handleMarkRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    router.refresh();
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length > 0) {
      await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('notifications.title')}</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllRead} className="px-3 py-1.5 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover">
            {t('notifications.markAllRead')}
          </button>
          <HelpButton content={t('help.pages.notifications')} />
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Bell className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted">{t('notifications.noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-card p-4 flex items-start justify-between ${!notification.is_read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div>
                <p className="font-medium text-sm">{notification.title}</p>
                {notification.message && <p className="text-xs text-muted mt-1">{notification.message}</p>}
                <p className="text-xs text-muted mt-2" suppressHydrationWarning>{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.is_read && (
                <button onClick={() => handleMarkRead(notification.id)} className="p-1.5 rounded-lg hover:bg-surface-hover text-primary">
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
