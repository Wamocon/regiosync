import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShopsClient } from './ShopsClient';

export default async function ShopsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) redirect(`/${locale}/login`);

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single();

    const { data: shops } = await supabase
      .from('shops')
      .select(`
        *,
        owner:owner_id(full_name),
        products(id, name, price, category, discount, is_available),
        reviews(rating),
        shop_hours(*)
      `)
      .order('created_at', { ascending: false });

    return <ShopsClient shops={shops ?? []} isPro={profile?.is_pro ?? false} />;
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
    console.error('[ShopsPage] Supabase error:', err);
    redirect(`/${locale}/login`);
  }
}
