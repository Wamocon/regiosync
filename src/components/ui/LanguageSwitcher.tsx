'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'de' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-all duration-200 text-sm font-medium"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4 text-muted" />
      <span className="uppercase text-foreground">{locale === 'en' ? 'DE' : 'EN'}</span>
    </button>
  );
}
