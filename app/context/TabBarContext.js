import { createContext } from 'react';

export const TabBarContext = createContext({
  isTabBarVisible: true,
  setIsTabBarVisible: () => {},
}); 