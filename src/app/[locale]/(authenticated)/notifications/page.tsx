import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NotificationsClient } from './NotificationsClient';

export default async function NotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) redirect(`/${locale}/login`);

    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return <NotificationsClient notifications={notifications ?? []} />;
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
    console.error('[NotificationsPage] Supabase error:', err);
    redirect(`/${locale}/login`);
  }
}
