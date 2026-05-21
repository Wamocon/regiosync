import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ShopDetailClient } from './ShopDetailClient';

export default async function ShopDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: shop } = await supabase
    .from('shops')
    .select('*, products(*)')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!shop) notFound();

  return <ShopDetailClient shop={shop} />;
}
