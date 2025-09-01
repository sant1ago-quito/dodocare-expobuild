import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  isGuest: false,
  isLogged: false,
  login: () => {},
  loginAsGuest: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const login = () => {
    setIsLogged(true);
    setIsGuest(false);
  };
  const loginAsGuest = () => {
    setIsLogged(false);
    setIsGuest(true);
  };
  const logout = () => {
    setIsLogged(false);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ isGuest, isLogged, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Default export: wrapper component for routing
const AuthContextScreen: React.FC = () => {
  return (
    <AuthProvider>
      {/* Puedes renderizar children o una pantalla de login aquí si lo deseas */}
      <></>
    </AuthProvider>
  );
};
export default AuthContextScreen;