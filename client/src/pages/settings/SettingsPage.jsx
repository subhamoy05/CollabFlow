import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  Building,
  Mail,
  Palette,
  Check,
  Send,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOrganization } from '../../context/OrganizationContext';
import { organizationService } from '../../services/organizationService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currentOrg } = useOrganization();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Organization Member Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Team Member');
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileMsg('');
      await updateUser({ name, avatarUrl });
      setProfileMsg('Profile successfully updated.');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !currentOrg?._id) return;

    try {
      setInviting(true);
      setInviteMsg('');
      const res = await organizationService.inviteMember(currentOrg._id, {
        email: inviteEmail,
        role: inviteRole
      });
      setInviteEmail('');
      setInviteMsg('Invitation token created successfully!');
      if (res.data?.inviteLink) {
        console.log('Invite Link:', res.data.inviteLink);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" /> Account & Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal identity, theme appearance, and workspace collaborators.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" /> Profile Information
        </h3>

        {profileMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
            {profileMsg}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <Avatar user={{ ...user, avatarUrl }} size="lg" />
            <div className="text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100">{user?.name}</div>
              <div className="text-slate-400">{user?.email}</div>
              <Badge size="xs" className="mt-1">{user?.role}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Avatar Image URL (Optional)"
              placeholder="https://images.unsplash.com/..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" loading={savingProfile}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Theme Appearance Card */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" /> Interface Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Select your preferred visual style. Your choice is automatically persisted in your browser.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
              theme === 'light'
                ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-600 text-indigo-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>☀️ Light Mode</span>
            {theme === 'light' && <Check className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
              theme === 'dark'
                ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-600 text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>🌙 Dark Mode</span>
            {theme === 'dark' && <Check className="w-4 h-4" />}
          </button>
        </div>
      </Card>

      {/* Workspace Collaborators Card */}
      {currentOrg && (
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" /> Workspace Members ({currentOrg.name})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Invite colleagues by email to collaborate on projects within this workspace.
          </p>

          {inviteMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
              {inviteMsg}
            </div>
          )}

          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-2.5 mb-4">
            <input
              type="email"
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="flex-1 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            >
              <option value="Team Member">Team Member</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Viewer">Viewer</option>
            </select>
            <Button type="submit" size="sm" icon={Send} loading={inviting}>
              Send Invite
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
