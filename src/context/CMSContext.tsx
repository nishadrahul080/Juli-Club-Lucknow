import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCMSData, saveCMSData, resetCMSData, CMSData, SiteSettings, BlogPost } from '../data/cmsStore';
import { CompanionProfile, Review, LocationPageInfo } from '../types';

interface CMSContextType {
  cmsData: CMSData;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateProfiles: (newProfiles: CompanionProfile[]) => void;
  updateReviews: (newReviews: Review[]) => void;
  updateFAQs: (newFAQs: { id: string; question: string; answer: string; category: string }[]) => void;
  updateLocations: (newLocations: Record<string, LocationPageInfo>) => void;
  updateBlogs: (newBlogs: BlogPost[]) => void;
  resetToDefaults: () => void;
  exportCMSConfig: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => getCMSData());

  useEffect(() => {
    saveCMSData(cmsData);
  }, [cmsData]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setCmsData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const updateProfiles = (newProfiles: CompanionProfile[]) => {
    setCmsData(prev => ({ ...prev, profiles: newProfiles }));
  };

  const updateReviews = (newReviews: Review[]) => {
    setCmsData(prev => ({ ...prev, reviews: newReviews }));
  };

  const updateFAQs = (newFAQs: { id: string; question: string; answer: string; category: string }[]) => {
    setCmsData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const updateLocations = (newLocations: Record<string, LocationPageInfo>) => {
    setCmsData(prev => ({ ...prev, locations: newLocations }));
  };

  const updateBlogs = (newBlogs: BlogPost[]) => {
    setCmsData(prev => ({ ...prev, blogs: newBlogs }));
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
        updateSettings,
        updateProfiles,
        updateReviews,
        updateFAQs,
        updateLocations,
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
