'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Users, ShieldCheck, Store, Ban, Trash2, UserCheck, AlertTriangle } from 'lucide-react';
import { HelpButton } from '@/components/ui/HelpButton';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_pro: boolean;
  is_banned: boolean;
  created_at: string;
}

interface Report {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter: { full_name: string; email: string } | null;
  reported_user: { full_name: string; email: string } | null;
}

export function AdminDashboardClient({ users, reports }: { users: Profile[]; reports: Report[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const supabase = createClient();

  const totalSellers = users.filter(u => u.role === 'seller').length;
  const totalCustomers = users.filter(u => u.role === 'user').length;
  const activeUsers = users.filter(u => !u.is_banned).length;

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    await supabase.from('profiles').update({ is_banned: !isBanned }).eq('id', userId);
    router.refresh();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    const res = await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? t('admin.failedDeleteUser'));
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    router.refresh();
  };

  const handleResolveReport = async (reportId: string, status: string) => {
    await supabase.from('reports').update({ status }).eq('id', reportId);
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <p className="text-muted mt-1">{t('admin.userManagement')}</p>
        </div>
        <HelpButton content={t('help.pages.admin')} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users className="w-5 h-5" />} label={t('admin.totalUsers')} value={users.length} />
        <StatCard icon={<Store className="w-5 h-5" />} label={t('admin.totalSellers')} value={totalSellers} />
        <StatCard icon={<UserCheck className="w-5 h-5" />} label={t('admin.totalCustomers')} value={totalCustomers} />
        <StatCard icon={<ShieldCheck className="w-5 h-5" />} label={t('admin.activeUsers')} value={activeUsers} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'users' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-hover text-foreground'
          }`}
        >
          {t('admin.userList')}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'reports' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-hover text-foreground'
          }`}
        >
          {t('admin.reports')} ({reports.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {/* User List */}
      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">{t('auth.fullName')}</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">{t('auth.email')}</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">{t('admin.assignRole')}</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">{t('admin.status')}</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-hover/50">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {u.full_name}
                        {u.is_pro && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-accent text-white rounded">PRO</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="text-sm rounded-lg border border-border bg-surface px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="user">{t('admin.roleUser')}</option>
                        <option value="seller">{t('admin.roleSeller')}</option>
                        <option value="super_admin">{t('admin.roleSuperAdmin')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.is_banned ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {u.is_banned ? t('admin.banned') : t('admin.active')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleBanUser(u.id, u.is_banned)}
                          className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-accent transition-colors"
                          title={u.is_banned ? t('admin.unbanUser') : t('admin.banUser')}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg hover:bg-surface-hover text-muted hover:text-red-500 transition-colors"
                          title={t('admin.deleteUser')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="glass-card p-8 text-center text-muted">
              {t('common.noResults')}
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-accent" />
                      <span className="font-medium text-sm">{report.reason}</span>
                    </div>
                    <p className="text-xs text-muted">
                      {t('admin.reportBy')}: {report.reporter?.full_name} | {t('admin.reportAgainst')}: {report.reported_user?.full_name}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      <span suppressHydrationWarning>{new Date(report.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveReport(report.id, 'resolved')}
                        className="px-3 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark"
                      >
                        {t('admin.resolveReport')}
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'dismissed')}
                        className="px-3 py-1 text-xs bg-surface border border-border text-foreground rounded-lg hover:bg-surface-hover"
                      >
                        {t('admin.dismissReport')}
                      </button>
                    </div>
                  )}
                  {report.status !== 'pending' && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status === 'resolved' ? t('admin.reportResolved') : t('admin.reportDismissed')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
