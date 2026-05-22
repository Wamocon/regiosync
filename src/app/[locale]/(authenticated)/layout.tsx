import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gracefully handle Supabase failures - middleware already guards auth
  let user = null;
  let profile = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, is_pro')
        .eq('id', user.id)
        .single();
      profile = profileData;
    }
  } catch (err) {
    console.error('[AuthenticatedLayout] Supabase error:', err);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userRole={profile?.role} isPro={profile?.is_pro} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
