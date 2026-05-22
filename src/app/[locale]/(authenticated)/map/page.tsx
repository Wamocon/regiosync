import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MapClient } from './MapClient';

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
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
      .select('id, name, latitude, longitude, city, address')
      .eq('is_active', true);

    return <MapClient shops={shops ?? []} isPro={profile?.is_pro ?? false} />;
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'digest' in err) throw err;
    console.error('[MapPage] Supabase error:', err);
    redirect(`/${locale}/login`);
  }
}
