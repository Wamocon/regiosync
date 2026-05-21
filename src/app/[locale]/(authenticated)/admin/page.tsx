import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'super_admin') redirect(`/${locale}/dashboard`);

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: reports } = await supabase
    .from('reports')
    .select('*, reporter:reporter_id(full_name, email), reported_user:reported_user_id(full_name, email)')
    .order('created_at', { ascending: false });

  return <AdminDashboardClient users={users ?? []} reports={reports ?? []} />;
}
