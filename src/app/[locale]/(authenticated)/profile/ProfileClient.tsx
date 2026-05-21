'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, Link } from '@/i18n/navigation';
import { User, Mail, Shield, Crown, Calendar, HelpCircle } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  is_pro: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export function ProfileClient({ profile }: { profile: Profile }) {
  const t = useTranslations();
  const router = useRouter();
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', profile.id);
    setEditing(false);
    setLoading(false);
    router.refresh();
  };

  const roleLabel = profile.role === 'super_admin' ? t('admin.roleSuperAdmin') : profile.role === 'seller' ? t('admin.roleSeller') : t('admin.roleUser');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        <button onClick={() => setShowHelp(!showHelp)} className="p-2 rounded-lg hover:bg-surface-hover">
          <HelpCircle className="w-5 h-5 text-muted" />
        </button>
      </div>

      {showHelp && (
        <div className="mb-6 p-4 glass-card bg-primary/5">
          <p className="text-sm text-muted">{t('help.tooltip')}</p>
        </div>
      )}

      <div className="glass-card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">{roleLabel}</span>
              {profile.is_pro && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted">{t('profile.personalInfo')}</h3>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <User className="w-5 h-5 text-muted" />
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-1 bg-transparent border-b border-primary focus:outline-none"
              />
            ) : (
              <span>{profile.full_name}</span>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <Mail className="w-5 h-5 text-muted" />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <Shield className="w-5 h-5 text-muted" />
            <span>{roleLabel}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <Calendar className="w-5 h-5 text-muted" />
            <span suppressHydrationWarning>{t('profile.memberSince')}: {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-border flex gap-3">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark text-sm font-medium disabled:opacity-50">
                {loading ? t('common.loading') : t('common.save')}
              </button>
              <button onClick={() => { setEditing(false); setFullName(profile.full_name); }} className="px-6 py-2.5 border border-border rounded-xl text-sm">
                {t('common.cancel')}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark text-sm font-medium">
              {t('profile.editProfile')}
            </button>
          )}
        </div>
      </div>

      {/* Subscription */}
      <div className="glass-card p-6 mt-6">
        <h3 className="font-semibold mb-4">{t('profile.subscription')}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t('profile.currentPlan')}: <span className={profile.is_pro ? 'text-accent' : 'text-muted'}>{profile.is_pro ? 'Pro' : t('common.free')}</span></p>
          </div>
          {!profile.is_pro && (
            <Link href="/pricing" className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90">
              {t('common.upgrade')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
