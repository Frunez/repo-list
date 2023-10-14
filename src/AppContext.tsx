import React, { createContext } from "react";

import OctokitService from "./services/octokit";

export interface AppContextType {
  octokitService: OctokitService;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<AppProviderProps> = ({ children }: AppProviderProps) => {
  const octokitService = new OctokitService();

  return <AppContext.Provider value={{ octokitService }}>{children}</AppContext.Provider>;
};
