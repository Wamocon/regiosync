'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ShoppingBag, Heart } from 'lucide-react';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">RegioSync</span>
            </div>
            <p className="text-muted text-sm max-w-md">
              {t('common.tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">{t('footer.about')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-sm text-muted hover:text-primary transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-muted hover:text-primary transition-colors">
                  {t('help.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/imprint" className="text-sm text-muted hover:text-primary transition-colors">
                  {t('footer.imprint')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} WAMOCON GmbH. {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>{t('footer.madeIn')}</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
