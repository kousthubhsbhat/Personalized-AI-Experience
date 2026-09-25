import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, isSessionActive, getActiveUsername } from '../services/api';
import { LearningPathway, PathwayModule, UserSkill, Profile } from '../types';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
}

interface AppContextType {
  isAuthenticated: boolean;
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
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  signOut: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshPathway: () => Promise<void>;
  updatePathwayState: (newPathway: LearningPathway, updatedSkills?: UserSkill[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionActive() && !!getActiveUsername());
  const [pathway, setPathway] = useState<LearningPathway | null>(null);
  const [modules, setModules] = useState<PathwayModule[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingPathway, setIsLoadingPathway] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<PathwayModule | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [copilotModuleContext, setCopilotModuleContext] = useState<PathwayModule | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
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

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const signOut = () => {
    api.signOutUser();
    setIsAuthenticated(false);
    setProfile(null);
    setPathway(null);
    setModules([]);
    setSkills([]);
    addToast({
      type: 'info',
      title: 'Signed Out',
      description: 'You have been safely signed out. Please sign in to access learning tracks.'
    });
  };

  const refreshPathway = async () => {
    const active = isSessionActive() && !!getActiveUsername();
    if (!active) {
      setIsAuthenticated(false);
      setProfile(null);
      setPathway(null);
      setModules([]);
      setSkills([]);
      setIsLoadingPathway(false);
      return;
    }

    setIsLoadingPathway(true);
    try {
      const data = await api.getCurrentPathway();
      setPathway(data.pathway);
      setModules(data.pathway?.modules || []);
      setSkills(data.skills || []);
      setProfile(data.profile || null);
      setIsAuthenticated(true);
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
    if (!isAuthenticated) {
      openAuthModal('signin');
      addToast({
        type: 'warning',
        title: 'Authentication Required',
        description: 'Please sign in to interact with the AI Copilot.'
      });
      return;
    }
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
        isAuthenticated,
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        signOut,
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
