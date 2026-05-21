import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ShopViewClient } from './ShopViewClient';

export default async function ShopViewPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, is_pro')
    .eq('id', user.id)
    .single();

  const { data: shop } = await supabase
    .from('shops')
    .select(`
      *,
      owner:owner_id(full_name, email),
      products(*),
      reviews(*, user:user_id(full_name))
    `)
    .eq('id', id)
    .single();

  if (!shop) notFound();

  return <ShopViewClient shop={shop} userId={user.id} isPro={profile?.is_pro ?? false} />;
}
