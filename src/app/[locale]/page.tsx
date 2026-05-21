import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin, ShoppingBag, Leaf, Map, ArrowRight, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const t = await getTranslations();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('role,is_pro').eq('id', user.id).single();
    profile = data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} userRole={profile?.role} isPro={profile?.is_pro} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in">
                <span className="gradient-text">{t('home.heroTitle')}</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto animate-slide-up">
                {t('home.heroSubtitle')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                <Link
                  href="/shops"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {t('home.ctaExplore')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 border border-border text-foreground font-semibold rounded-xl hover:bg-surface-hover transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {t('home.ctaRegister')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<MapPin className="w-6 h-6 text-primary" />}
                title={t('home.featureLocalTitle')}
                description={t('home.featureLocalDesc')}
              />
              <FeatureCard
                icon={<ShoppingBag className="w-6 h-6 text-secondary" />}
                title={t('home.featureDirectTitle')}
                description={t('home.featureDirectDesc')}
              />
              <FeatureCard
                icon={<Leaf className="w-6 h-6 text-primary" />}
                title={t('home.featureFreshTitle')}
                description={t('home.featureFreshDesc')}
              />
              <FeatureCard
                icon={<Map className="w-6 h-6 text-accent" />}
                title={t('home.featureMapTitle')}
                description={t('home.featureMapDesc')}
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              {t('home.howItWorksTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard number={1} title={t('home.step1Title')} description={t('home.step1Desc')} />
              <StepCard number={2} title={t('home.step2Title')} description={t('home.step2Desc')} />
              <StepCard number={3} title={t('home.step3Title')} description={t('home.step3Desc')} />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value="150+" label={t('home.statsShops')} />
              <StatCard value="2,500+" label={t('home.statsProducts')} />
              <StatCard value="10,000+" label={t('home.statsUsers')} />
              <StatCard value="50+" label={t('home.statsRegions')} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-card p-12">
              <Star className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">{t('common.getStarted')}</h2>
              <p className="text-muted mb-8 max-w-lg mx-auto">{t('home.heroSubtitle')}</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200"
              >
                {t('common.signUp')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-6">
      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-primary">{number}</span>
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold gradient-text">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}
