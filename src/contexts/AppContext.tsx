import React, { createContext, useState, ReactNode } from 'react';

interface AppContextProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any>(null);

  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };