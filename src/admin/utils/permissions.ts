export type UserRole = 'Super Admin' | 'Admin' | 'SEO Manager' | 'Content Writer' | 'Editor';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'EDIT' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'UPLOAD' | 'SEO_CHANGE' | 'SETTINGS_CHANGE' | 'USER_MANAGEMENT' | 'BACKUP_RESTORE';
  module: string;
  details: string;
  ipAddress: string;
}

export interface BackupHistoryItem {
  id: string;
  filename: string;
  createdAt: string;
  sizeKb: number;
  type: 'Full CMS Data' | 'SEO & Settings' | 'Profiles & Content';
  createdBy: string;
}

// Module IDs supported in CMS
export type CMSModuleId =
  | 'dashboard'
  | 'homepage'
  | 'location-pages'
  | 'profiles'
  | 'blogs'
  | 'media-library'
  | 'seo'
  | 'reviews'
  | 'faq'
  | 'settings'
  | 'system'
  | 'users'
  | 'activity-logs'
  | 'backup-restore'
  | 'visual-builder'
  | 'white-label';

// Role Permissions Definition
export const ROLE_PERMISSIONS: Record<UserRole, CMSModuleId[]> = {
  'Super Admin': [
    'dashboard',
    'homepage',
    'location-pages',
    'profiles',
    'blogs',
    'media-library',
    'seo',
    'reviews',
    'faq',
    'visual-builder',
    'white-label',
    'settings',
    'system',
    'users',
    'activity-logs',
    'backup-restore'
  ],
  'Admin': [
    'dashboard',
    'homepage',
    'location-pages',
    'profiles',
    'blogs',
    'media-library',
    'seo',
    'reviews',
    'faq',
    'visual-builder',
    'white-label',
    'settings',
    'system',
    'activity-logs',
    'backup-restore'
  ],
  'SEO Manager': [
    'dashboard',
    'location-pages',
    'blogs',
    'seo',
    'faq',
    'visual-builder'
  ],
  'Content Writer': [
    'dashboard',
    'homepage',
    'location-pages',
    'profiles',
    'blogs',
    'faq'
  ],
  'Editor': [
    'dashboard',
    'homepage',
    'location-pages',
    'profiles',
    'blogs',
    'media-library',
    'reviews',
    'faq',
    'visual-builder'
  ]
};

export const hasPermission = (role: UserRole, moduleId: CMSModuleId): boolean => {
  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Admin'];
  return allowed.includes(moduleId);
};
