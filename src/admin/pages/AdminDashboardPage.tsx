import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardModule } from '../modules/DashboardModule';
import { MediaLibraryModule } from '../modules/MediaLibraryModule';
import { ProfilesModule } from '../modules/ProfilesModule';
import { PlaceholderModule } from '../modules/PlaceholderModule';
import { SettingsModule } from '../modules/SettingsModule';
import { SystemModule } from '../modules/SystemModule';
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
        return (
          <PlaceholderModule
            title="Homepage Content Manager"
            description="Manage hero banners, main headings, introductory paragraphs, and high-converting call-to-action buttons."
            category="Frontend Layout"
            icon={<Home className="w-6 h-6" />}
          />
        );

      case 'location-pages':
        return (
          <PlaceholderModule
            title="Lucknow Location Pages Engine"
            description="Create and customize SEO landing pages for Gomti Nagar, Hazratganj, Alambagh, Indira Nagar, and all Lucknow coverage areas."
            category="Area Landing Routes"
            icon={<MapPin className="w-6 h-6" />}
          />
        );

      case 'profiles':
        return <ProfilesModule />;

      case 'media-library':
        return <MediaLibraryModule />;

      case 'seo':
        return (
          <PlaceholderModule
            title="Global SEO & Meta Tag Engine"
            description="Configure meta titles, meta descriptions, canonical URLs, JSON-LD structured schema, and OpenGraph social cards."
            category="Search Optimization"
            icon={<Search className="w-6 h-6" />}
          />
        );

      case 'reviews':
        return (
          <PlaceholderModule
            title="Client Reviews & Testimonials"
            description="Moderate, approve, and showcase client feedback, star ratings, and verified booking testimonials."
            category="Client Feedback"
            icon={<Star className="w-6 h-6" />}
          />
        );

      case 'faq':
        return (
          <PlaceholderModule
            title="FAQ Accordion & Schema Manager"
            description="Edit structured frequently asked questions to boost Google rich snippets and answer client queries."
            category="Search Schema"
            icon={<HelpCircle className="w-6 h-6" />}
          />
        );

      case 'settings':
        return <SettingsModule />;

      case 'system':
        return <SystemModule />;

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
