import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type TokenContextType = {
  tokens: Tokens;
  setTokens: (tokens: Tokens) => void;
};

// Create the context with default values
const TokenContext = createContext<TokenContextType>({
  tokens: { accessToken: null, refreshToken: null },
  setTokens: () => {},
});

// Create the provider
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokensState] = useState<Tokens>(() => {
    const storedTokens = localStorage.getItem('tokens');    
    return storedTokens ? JSON.parse(storedTokens) : { accessToken: null, refreshToken: null };
  });

  const setTokens = (newTokens: Tokens) => {
    setTokensState(newTokens);
  };

  useEffect(() => {
    if (tokens.accessToken || tokens.refreshToken) {
      localStorage.setItem('tokens', JSON.stringify(tokens));
    } else {
      localStorage.removeItem('tokens');
    }
  }, [tokens]);

  return (
    <TokenContext.Provider value={{ tokens, setTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the context
export const useTokenContext = () => useContext(TokenContext);