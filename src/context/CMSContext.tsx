import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCMSData, resetCMSData, CMSData, SiteSettings, HomepageConfig, BlogPost } from '../data/cmsStore';
import { CompanionProfile, Review, LocationPageInfo, CMSSection, RedirectRule } from '../types';
import { cmsDatabaseApi } from '../api/cmsDatabaseApi';

interface CMSContextType {
  cmsData: CMSData;
  isPreviewMode: boolean;
  togglePreviewMode: (enabled?: boolean) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateHomepage: (newHomepage: Partial<HomepageConfig>) => void;
  updateHomepageSections: (newSections: CMSSection[]) => void;
  updateProfiles: (newProfiles: CompanionProfile[]) => void;
  updateReviews: (newReviews: Review[]) => void;
  updateFAQs: (newFAQs: { id: string; question: string; answer: string; category: string }[]) => void;
  updateLocations: (newLocations: Record<string, LocationPageInfo>) => void;
  addLocationPage: (location: LocationPageInfo) => void;
  deleteLocationPage: (slug: string) => void;
  updateRedirects: (newRedirects: RedirectRule[]) => void;
  updateBlogs: (newBlogs: BlogPost[]) => void;
  resetToDefaults: () => void;
  exportCMSConfig: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => getCMSData());
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Synchronize state with database repository layer on boot
  useEffect(() => {
    cmsDatabaseApi.loadFullCMSData().then(data => {
      if (data) {
        setCmsData(data);
      }
    }).catch(err => {
      console.error('Error loading data from database repository layer:', err);
    });
  }, []);

  const togglePreviewMode = (enabled?: boolean) => {
    setIsPreviewMode(prev => (enabled !== undefined ? enabled : !prev));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setCmsData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    cmsDatabaseApi.updateSettings(newSettings).catch(err => console.error('DB sync error:', err));
  };

  const updateHomepage = (newHomepage: Partial<HomepageConfig>) => {
    setCmsData(prev => ({
      ...prev,
      homepage: { ...prev.homepage, ...newHomepage }
    }));
    cmsDatabaseApi.updateHomepage(newHomepage).catch(err => console.error('DB sync error:', err));
  };

  const updateHomepageSections = (newSections: CMSSection[]) => {
    setCmsData(prev => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        sections: newSections
      }
    }));
    cmsDatabaseApi.updateHomepageSections(newSections).catch(err => console.error('DB sync error:', err));
  };

  const updateProfiles = (newProfiles: CompanionProfile[]) => {
    setCmsData(prev => ({ ...prev, profiles: newProfiles }));
    cmsDatabaseApi.updateProfiles(newProfiles).catch(err => console.error('DB sync error:', err));
  };

  const updateReviews = (newReviews: Review[]) => {
    setCmsData(prev => ({ ...prev, reviews: newReviews }));
    cmsDatabaseApi.updateReviews(newReviews).catch(err => console.error('DB sync error:', err));
  };

  const updateFAQs = (newFAQs: { id: string; question: string; answer: string; category: string }[]) => {
    setCmsData(prev => ({ ...prev, faqs: newFAQs }));
    cmsDatabaseApi.updateFAQs(newFAQs).catch(err => console.error('DB sync error:', err));
  };

  const updateLocations = (newLocations: Record<string, LocationPageInfo>) => {
    setCmsData(prev => ({ ...prev, locations: newLocations }));
    cmsDatabaseApi.updateLocations(newLocations).catch(err => console.error('DB sync error:', err));
  };

  const addLocationPage = (location: LocationPageInfo) => {
    setCmsData(prev => ({
      ...prev,
      locations: {
        ...prev.locations,
        [location.slug]: location
      }
    }));
    cmsDatabaseApi.addLocationPage(location).catch(err => console.error('DB sync error:', err));
  };

  const deleteLocationPage = (slug: string) => {
    setCmsData(prev => {
      const nextLocs = { ...prev.locations };
      delete nextLocs[slug];
      return { ...prev, locations: nextLocs };
    });
    cmsDatabaseApi.deleteLocationPage(slug).catch(err => console.error('DB sync error:', err));
  };

  const updateRedirects = (newRedirects: RedirectRule[]) => {
    setCmsData(prev => ({ ...prev, redirects: newRedirects }));
    cmsDatabaseApi.updateRedirects(newRedirects).catch(err => console.error('DB sync error:', err));
  };

  const updateBlogs = (newBlogs: BlogPost[]) => {
    setCmsData(prev => ({ ...prev, blogs: newBlogs }));
    cmsDatabaseApi.updateBlogs(newBlogs).catch(err => console.error('DB sync error:', err));
  };

  const resetToDefaults = () => {
    const defaultData = resetCMSData();
    setCmsData(defaultData);
  };

  const exportCMSConfig = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(cmsData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'juli_club_cms_data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        isPreviewMode,
        togglePreviewMode,
        updateSettings,
        updateHomepage,
        updateHomepageSections,
        updateProfiles,
        updateReviews,
        updateFAQs,
        updateLocations,
        addLocationPage,
        deleteLocationPage,
        updateRedirects,
        updateBlogs,
        resetToDefaults,
        exportCMSConfig
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
