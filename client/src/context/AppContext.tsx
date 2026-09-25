import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { LearningPathway, PathwayModule, UserSkill, Profile } from '../types';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
}

interface AppContextType {
  pathway: LearningPathway | null;
  modules: PathwayModule[];
  skills: UserSkill[];
  profile: Profile | null;
  isLoadingPathway: boolean;
  selectedModule: PathwayModule | null;
  setSelectedModule: (mod: PathwayModule | null) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotModuleContext: PathwayModule | null;
  setCopilotModuleContext: (mod: PathwayModule | null) => void;
  openCopilotForModule: (mod?: PathwayModule) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshPathway: () => Promise<void>;
  updatePathwayState: (newPathway: LearningPathway, updatedSkills?: UserSkill[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathway, setPathway] = useState<LearningPathway | null>(null);
  const [modules, setModules] = useState<PathwayModule[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingPathway, setIsLoadingPathway] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<PathwayModule | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [copilotModuleContext, setCopilotModuleContext] = useState<PathwayModule | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshPathway = async () => {
    setIsLoadingPathway(true);
    try {
      const data = await api.getCurrentPathway();
      setPathway(data.pathway);
      setModules(data.pathway?.modules || []);
      setSkills(data.skills || []);
      setProfile(data.profile || null);
    } catch (err) {
      console.warn('Could not fetch current pathway:', err);
    } finally {
      setIsLoadingPathway(false);
    }
  };

  const updatePathwayState = (newPathway: LearningPathway, updatedSkills?: UserSkill[]) => {
    setPathway(newPathway);
    setModules(newPathway.modules || []);
    if (updatedSkills) {
      setSkills(updatedSkills);
    }
  };

  const openCopilotForModule = (mod?: PathwayModule) => {
    if (mod) {
      setCopilotModuleContext(mod);
    }
    setIsCopilotOpen(true);
  };

  useEffect(() => {
    refreshPathway();
  }, []);

  return (
    <AppContext.Provider
      value={{
        pathway,
        modules,
        skills,
        profile,
        isLoadingPathway,
        selectedModule,
        setSelectedModule,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotModuleContext,
        setCopilotModuleContext,
        openCopilotForModule,
        toasts,
        addToast,
        removeToast,
        refreshPathway,
        updatePathwayState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
