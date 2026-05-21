'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'de' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-all duration-200 text-sm font-medium min-w-18 justify-center disabled:opacity-60"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4 text-muted shrink-0" />
      {/* Show the OTHER locale so user knows what they're switching to */}
      <span className="uppercase text-foreground w-6 text-center">
        {locale === 'en' ? 'DE' : 'EN'}
      </span>
    </button>
  );
}
