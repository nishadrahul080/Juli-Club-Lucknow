import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCMSData, saveCMSData, resetCMSData, CMSData, SiteSettings, HomepageConfig, BlogPost } from '../data/cmsStore';
import { CompanionProfile, Review, LocationPageInfo, CMSSection, RedirectRule } from '../types';
import { cmsDatabaseApi } from '../api/cmsDatabaseApi';

interface CMSContextType {
  cmsData: CMSData;
  isPreviewMode: boolean;
  togglePreviewMode: (enabled?: boolean) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateHomepage: (newHomepage: Partial<HomepageConfig>) => Promise<void>;
  updateHomepageSections: (newSections: CMSSection[]) => Promise<void>;
  updateProfiles: (newProfiles: CompanionProfile[]) => Promise<void>;
  updateReviews: (newReviews: Review[]) => Promise<void>;
  updateFAQs: (newFAQs: { id: string; question: string; answer: string; category: string }[]) => Promise<void>;
  updateLocations: (newLocations: Record<string, LocationPageInfo>) => Promise<void>;
  addLocationPage: (location: LocationPageInfo) => Promise<void>;
  deleteLocationPage: (slug: string) => Promise<void>;
  updateRedirects: (newRedirects: RedirectRule[]) => Promise<void>;
  updateBlogs: (newBlogs: BlogPost[]) => Promise<void>;
  resetToDefaults: () => void;
  exportCMSConfig: () => void;
  refreshCMSData: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => getCMSData());
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const refreshCMSData = async () => {
    try {
      const data = await cmsDatabaseApi.loadFullCMSData();
      if (data) {
        setCmsData(data);
        saveCMSData(data);
      }
    } catch (err) {
      console.error('Error loading data from database API:', err);
    }
  };

  // Synchronize state with database repository layer on boot
  useEffect(() => {
    refreshCMSData();
  }, []);

  const togglePreviewMode = (enabled?: boolean) => {
    setIsPreviewMode(prev => (enabled !== undefined ? enabled : !prev));
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      await cmsDatabaseApi.updateSettings(newSettings);
      setCmsData(prev => {
        const nextData: CMSData = {
          ...prev,
          settings: { ...prev.settings, ...newSettings }
        };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateSettings]:', err);
      throw err;
    }
  };

  const updateHomepage = async (newHomepage: Partial<HomepageConfig>) => {
    try {
      await cmsDatabaseApi.updateHomepage(newHomepage);
      setCmsData(prev => {
        const nextData: CMSData = {
          ...prev,
          homepage: { ...prev.homepage, ...newHomepage }
        };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateHomepage]:', err);
      throw err;
    }
  };

  const updateHomepageSections = async (newSections: CMSSection[]) => {
    try {
      await cmsDatabaseApi.updateHomepageSections(newSections);
      setCmsData(prev => {
        const nextData: CMSData = {
          ...prev,
          homepage: {
            ...prev.homepage,
            sections: newSections
          }
        };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateHomepageSections]:', err);
      throw err;
    }
  };

  const updateProfiles = async (newProfiles: CompanionProfile[]) => {
    try {
      await cmsDatabaseApi.updateProfiles(newProfiles);
      setCmsData(prev => {
        const nextData: CMSData = { ...prev, profiles: newProfiles };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateProfiles]:', err);
      throw err;
    }
  };

  const updateReviews = async (newReviews: Review[]) => {
    try {
      await cmsDatabaseApi.updateReviews(newReviews);
      setCmsData(prev => {
        const nextData: CMSData = { ...prev, reviews: newReviews };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateReviews]:', err);
      throw err;
    }
  };

  const updateFAQs = async (newFAQs: { id: string; question: string; answer: string; category: string }[]) => {
    try {
      await cmsDatabaseApi.updateFAQs(newFAQs);
      setCmsData(prev => {
        const nextData: CMSData = { ...prev, faqs: newFAQs };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateFAQs]:', err);
      throw err;
    }
  };

  const updateLocations = async (newLocations: Record<string, LocationPageInfo>) => {
    try {
      await cmsDatabaseApi.updateLocations(newLocations);
      setCmsData(prev => {
        const nextData: CMSData = { ...prev, locations: newLocations };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateLocations]:', err);
      throw err;
    }
  };

  const addLocationPage = async (location: LocationPageInfo) => {
    try {
      await cmsDatabaseApi.addLocationPage(location);
      setCmsData(prev => {
        const nextData: CMSData = {
          ...prev,
          locations: {
            ...prev.locations,
            [location.slug]: location
          }
        };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - addLocationPage]:', err);
      throw err;
    }
  };

  const deleteLocationPage = async (slug: string) => {
    try {
      await cmsDatabaseApi.deleteLocationPage(slug);
      setCmsData(prev => {
        const nextLocs = { ...prev.locations };
        delete nextLocs[slug];
        const nextData: CMSData = { ...prev, locations: nextLocs };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - deleteLocationPage]:', err);
      throw err;
    }
  };

  const updateRedirects = async (newRedirects: RedirectRule[]) => {
    try {
      await cmsDatabaseApi.updateRedirects(newRedirects);
      setCmsData(prev => {
        const nextData: CMSData = { ...prev, redirects: newRedirects };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateRedirects]:', err);
      throw err;
    }
  };

  const updateBlogs = async (newBlogs: BlogPost[]) => {
    try {
      await cmsDatabaseApi.updateBlogs(newBlogs);
      setCmsData(prev => {
        const nextData: CMSData = { ...prev, blogs: newBlogs };
        saveCMSData(nextData);
        return nextData;
      });
    } catch (err) {
      console.error('[CMS Context Error - updateBlogs]:', err);
      throw err;
    }
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
        exportCMSConfig,
        refreshCMSData
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
