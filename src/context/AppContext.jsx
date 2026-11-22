import React, { createContext, useContext, useState } from 'react';
import { API_CONFIG } from '../constants/config';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current user representation (can be changed dynamically without hardcoding)
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    name: 'You (Demo User)',
    email: 'user@example.com',
    avatar: null,
  });

  const [baseUrl, setBaseUrl] = useState(API_CONFIG.DEFAULT_BASE_URL);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        baseUrl,
        setBaseUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
