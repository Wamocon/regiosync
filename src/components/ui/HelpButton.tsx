'use client';

import { HelpCircle, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface HelpButtonProps {
  /** The help content string, already translated by the caller */
  content: string;
  /** Optional modal title override; falls back to t('common.help') */
  title?: string;
}

/**
 * Accessible help button that opens a modal overlay on click.
 * Replaces the broken `<div cursor-help title="...">` pattern used across the app.
 */
export function HelpButton({ content, title }: HelpButtonProps) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-primary"
        aria-label={t('help')}
        aria-haspopup="dialog"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 id="help-modal-title" className="text-lg font-bold">
                  {title ?? t('help')}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-muted"
                aria-label={t('close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-2">
              {content.split('. ').filter(Boolean).map((sentence, i) => (
                <p key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{sentence.endsWith('.') ? sentence : `${sentence}.`}</span>
                </p>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <a
                href="/help"
                className="text-xs text-primary hover:underline"
                onClick={close}
              >
                {t('learnMore')} →
              </a>
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm font-medium"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
