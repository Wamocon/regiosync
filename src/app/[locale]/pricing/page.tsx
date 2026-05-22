import { createClient } from '@/lib/supabase/server';
import { PricingPageClient } from './PricingPageClient';

export default async function PricingPage() {
  // Gracefully handle Supabase failures in production (env vars, network, etc.)
  let user = null;
  let profile = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role,is_pro')
        .eq('id', user.id)
        .single();
      profile = profileData;
    }
  } catch (err) {
    console.error('[PricingPage] Supabase error:', err);
  }
  return <PricingPageClient user={user} userRole={profile?.role} isPro={profile?.is_pro} />;
}