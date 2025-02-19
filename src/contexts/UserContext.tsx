import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserData = {
  email: string;
  role: string;
};

type UserContextType = {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
};

// Create the context with default values
const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

// Create the provider
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = () => useContext(UserContext);