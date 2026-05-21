import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-background" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">RegioSync</span>
            </div>
            <p className="text-muted text-sm max-w-xs">{t('common.tagline')}</p>
          </div>

          {/* About links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">
              {t('footer.about')}
            </h4>
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

          {/* Legal links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Legal</h4>
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

        {/* Bottom row */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted text-center sm:text-left">
            &copy; {new Date().getFullYear()} WAMOCON GmbH. {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{t('footer.madeIn')}</span>
            <div className="rounded-full bg-white dark:bg-white/10 p-0.5 shadow-sm">
              <Image
                src="/made-in-germany-sign.svg"
                alt="Entwickelt in Deutschland"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

