import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardModule } from '../modules/DashboardModule';
import { MediaLibraryModule } from '../modules/MediaLibraryModule';
import { ProfilesModule } from '../modules/ProfilesModule';
import { HomepageModule } from '../modules/HomepageModule';
import { LocationModule } from '../modules/LocationModule';
import { BlogModule } from '../modules/BlogModule';
import { SeoModule } from '../modules/SeoModule';
import { PlaceholderModule } from '../modules/PlaceholderModule';
import { ReviewsModule } from '../modules/ReviewsModule';
import { FaqModule } from '../modules/FaqModule';
import { SettingsModule } from '../modules/SettingsModule';
import { SystemModule } from '../modules/SystemModule';
import { UserManagementModule } from '../modules/UserManagementModule';
import { ActivityLogsModule } from '../modules/ActivityLogsModule';
import { BackupRestoreModule } from '../modules/BackupRestoreModule';
import { VisualBuilderModule } from '../modules/VisualBuilderModule';
import { WhiteLabelModule } from '../modules/WhiteLabelModule';
import {
  Home,
  MapPin,
  Users,
  Image as ImageIcon,
  Search,
  Star,
  HelpCircle
} from 'lucide-react';

interface AdminDashboardPageProps {
  onUnauthenticatedRedirect: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onUnauthenticatedRedirect }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Guard: Redirect to /admin-login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onUnauthenticatedRedirect();
    }
  }, [isAuthenticated, onUnauthenticatedRedirect]);

  if (!isAuthenticated) {
    return null;
  }

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule onNavigateTab={setActiveTab} />;

      case 'homepage':
        return <HomepageModule />;

      case 'visual-builder':
        return <VisualBuilderModule />;

      case 'location-pages':
        return <LocationModule />;

      case 'profiles':
        return <ProfilesModule />;

      case 'blogs':
        return <BlogModule />;

      case 'media-library':
        return <MediaLibraryModule />;

      case 'seo':
        return <SeoModule />;

      case 'reviews':
        return <ReviewsModule />;

      case 'faq':
        return <FaqModule />;

      case 'white-label':
        return <WhiteLabelModule />;

      case 'settings':
        return <SettingsModule />;

      case 'system':
        return <SystemModule />;

      case 'users':
        return <UserManagementModule />;

      case 'activity-logs':
        return <ActivityLogsModule />;

      case 'backup-restore':
        return <BackupRestoreModule />;

      default:
        return <DashboardModule onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {renderModule()}
    </AdminLayout>
  );
};
