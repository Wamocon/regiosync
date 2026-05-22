import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { ShopViewClient } from './ShopViewClient';

export default async function ShopViewPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
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
        reviews(*, user:user_id(full_name)),
        shop_hours(*)
      `)
      .eq('id', id)
      .single();

    if (!shop) notFound();

    // Fetch this user's existing requests for this shop (to show "Requested" labels)
    const { data: existingRequests } = await supabase
      .from('product_requests')
      .select('title')
      .eq('shop_id', id)
      .eq('user_id', user.id);

    const requestedTitles = (existingRequests ?? []).map((r: { title: string }) => r.title.toLowerCase());

    // Fetch subscription state
    const [{ data: shopSub }, { data: productSubs }] = await Promise.all([
      supabase.from('shop_subscriptions').select('id').eq('user_id', user.id).eq('shop_id', id).maybeSingle(),
      supabase.from('product_subscriptions').select('product_id').eq('user_id', user.id),
    ]);
    const subscribedProductIds = (productSubs ?? []).map((s: { product_id: string }) => s.product_id);

    return (
      <ShopViewClient
        shop={shop}
        userId={user.id}
        isPro={profile?.is_pro ?? false}
        requestedTitles={requestedTitles}
        isSubscribedToShop={!!shopSub}
        subscribedProductIds={subscribedProductIds}
      />
    );
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
    console.error('[ShopViewPage] Supabase error:', err);
    redirect(`/${locale}/login`);
  }
}
