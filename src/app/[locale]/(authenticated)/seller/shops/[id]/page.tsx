import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ShopDetailClient } from './ShopDetailClient';
import { ShopHoursManager } from './ShopHoursManager';

export default async function ShopDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [{ data: shop }, { data: hours }, { data: overrides }] = await Promise.all([
    supabase.from('shops').select('*, products(*)').eq('id', id).eq('owner_id', user.id).single(),
    supabase.from('shop_hours').select('*').eq('shop_id', id),
    supabase.from('shop_overrides').select('*').eq('shop_id', id).gt('until', new Date().toISOString()).order('created_at', { ascending: false }).limit(1),
  ]);

  if (!shop) notFound();

  const activeOverride = overrides && overrides.length > 0 ? overrides[0] : null;

  return (
    <>
      <ShopDetailClient shop={shop} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ShopHoursManager
          shopId={id}
          initialHours={hours ?? []}
          activeOverride={activeOverride}
        />
      </div>
    </>
  );
}
