'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, Link } from '@/i18n/navigation';
import { User, Mail, Shield, Crown, Calendar, HelpCircle, Camera } from 'lucide-react';
import Image from 'next/image';

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', profile.id);
    setEditing(false);
    setLoading(false);
    router.refresh();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${profile.id}.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', profile.id);
      setAvatarUrl(url);
    }
    setAvatarLoading(false);
  };

  const roleLabel = profile.role === 'super_admin' ? t('admin.roleSuperAdmin') : profile.role === 'seller' ? t('admin.roleSeller') : t('admin.roleUser');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        <div
          className="p-2 rounded-lg hover:bg-surface-hover cursor-help"
          title={t('help.pages.profile')}
        >
          <HelpCircle className="w-5 h-5 text-muted" />
        </div>
      </div>

      <div className="glass-card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={profile.full_name} width={80} height={80} className="object-cover w-full h-full" unoptimized />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md"
              title={t('profile.uploadAvatar')}
            >
              {avatarLoading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
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
            <p className="text-xs text-muted mt-1">{t('profile.uploadAvatar')}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted">{t('profile.personalInfo')}</h3>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <User className="w-5 h-5 text-muted shrink-0" />
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
            <Mail className="w-5 h-5 text-muted shrink-0" />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <Shield className="w-5 h-5 text-muted shrink-0" />
            <span>{roleLabel}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <Calendar className="w-5 h-5 text-muted shrink-0" />
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
