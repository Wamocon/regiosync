import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProductsClient } from './ProductsClient';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) redirect(`/${locale}/login`);

    // Fetch all products with shop + owner info
    const { data: rawProducts } = await supabase
      .from('products')
      .select(
        `id, name, description, price, quantity, category, discount, is_available, image_url, dietary_type,
      shop:shop_id(id, name, city, address, owner:owner_id(full_name))`
      )
      .order('name');

    // Supabase returns the joined side as an array - normalise to object | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = ((rawProducts ?? []) as any[]).map((p) => ({
      ...p,
      shop: Array.isArray(p.shop) ? (p.shop[0] ?? null) : p.shop,
    }));

    return <ProductsClient products={products} />;
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
    console.error('[ProductsPage] Supabase error:', err);
    redirect(`/${locale}/login`);
  }
}
