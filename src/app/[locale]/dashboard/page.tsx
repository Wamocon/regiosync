import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      redirect(`/${locale}/login`);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'super_admin') {
      redirect(`/${locale}/admin`);
    } else if (profile?.role === 'seller') {
      redirect(`/${locale}/seller/dashboard`);
    } else {
      redirect(`/${locale}/shops`);
    }
  } catch (err) {
    // Re-throw Next.js redirect errors (they use a special thrown signal)
    if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
    console.error('[DashboardPage] Supabase error:', err);
    redirect(`/${locale}/login`);
  }
}
