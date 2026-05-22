import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SellerDashboardClient } from './SellerDashboardClient';

export default async function SellerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'seller') redirect(`/${locale}/dashboard`);

  const { data: shops } = await supabase
    .from('shops')
    .select('*, products(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  const shopIds = (shops ?? []).map(s => s.id);

  const { data: requests } = shopIds.length > 0
    ? await supabase
        .from('product_requests')
        .select('*, user:user_id(full_name)')
        .in('shop_id', shopIds)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] };

  const { data: reviews } = shopIds.length > 0
    ? await supabase
        .from('reviews')
        .select('*, user:user_id(full_name)')
        .in('shop_id', shopIds)
        .order('created_at', { ascending: false })
    : { data: [] };

  return (
    <SellerDashboardClient
      profile={profile}
      shops={shops ?? []}
      requests={requests ?? []}
      reviews={reviews ?? []}
    />
  );
}
