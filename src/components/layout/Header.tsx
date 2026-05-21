'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Menu, X, Bell, User, LogOut, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';

interface HeaderProps {
  user?: { id: string; email?: string } | null;
  userRole?: string | null;
  isPro?: boolean;
}

export function Header({ user, userRole, isPro }: HeaderProps) {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid: [logo] [nav – 1fr, centered] [controls]
            Left and right columns are sized to content so they never shift
            when the nav text changes length on language switch. */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">RegioSync</span>
            {isPro && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded">PRO</span>
            )}
          </Link>

          {/* Desktop Nav - centred in the 1fr column */}
          <nav className="hidden md:flex items-center justify-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface-hover transition-colors whitespace-nowrap">
              {t('nav.home')}
            </Link>
            {user && userRole === 'super_admin' && (
              <Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface-hover transition-colors whitespace-nowrap">
                {t('nav.admin')}
              </Link>
            )}
            {user && userRole === 'seller' && (
              <Link href="/seller/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface-hover transition-colors whitespace-nowrap">
                {t('nav.myShop')}
              </Link>
            )}
            {user && (
              <>
                <Link href="/shops" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface-hover transition-colors whitespace-nowrap">
                  {t('nav.shops')}
                </Link>
                <Link href="/map" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface-hover transition-colors whitespace-nowrap">
                  {t('nav.map')}
                </Link>
              </>
            )}
            <Link href="/pricing" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface-hover transition-colors whitespace-nowrap">
              {t('nav.pricing')}
            </Link>
          </nav>

          {/* Right controls - always sized to their own content */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/notifications" className="p-2 rounded-lg hover:bg-surface-hover transition-colors relative">
                  <Bell className="w-5 h-5 text-muted" />
                </Link>
                <Link href="/profile" className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <User className="w-5 h-5 text-muted" />
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                  <LogOut className="w-5 h-5 text-muted" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover rounded-lg transition-colors whitespace-nowrap">
                  {t('common.login')}
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                  {t('common.signUp')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-hover"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-1">
              <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.home')}
              </Link>
              {user && userRole === 'super_admin' && (
                <Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.admin')}
                </Link>
              )}
              {user && userRole === 'seller' && (
                <Link href="/seller/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.myShop')}
                </Link>
              )}
              {user && (
                <>
                  <Link href="/shops" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.shops')}
                  </Link>
                  <Link href="/map" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.map')}
                  </Link>
                </>
              )}
              <Link href="/pricing" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.pricing')}
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                    {t('common.profile')}
                  </Link>
                  <Link href="/notifications" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.notifications')}
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-left text-red-500">
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-hover" onClick={() => setMobileMenuOpen(false)}>
                    {t('common.login')}
                  </Link>
                  <Link href="/register" className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark" onClick={() => setMobileMenuOpen(false)}>
                    {t('common.signUp')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
