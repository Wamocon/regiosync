import { createClient } from '@/lib/supabase/server';
import { PricingPageClient } from './PricingPageClient';

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('role,is_pro').eq('id', user.id).single();
    profile = data;
  }
  return <PricingPageClient user={user} userRole={profile?.role} isPro={profile?.is_pro} />;
}