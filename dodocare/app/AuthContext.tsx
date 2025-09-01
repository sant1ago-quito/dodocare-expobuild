import React, { createContext, useContext, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext({
  isGuest: false,
  isLogged: false,
  login: async (_email?: string, _password?: string) => {},
  loginAsGuest: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const login = async (email?: string, password?: string) => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsLogged(true);
        setIsGuest(false);
      } catch (error) {
        setIsLogged(false);
        throw error; // Lanzar el error para que el formulario lo capture
      }
    } else {
      throw new Error('Email y contraseña requeridos');
    }
  };
  const loginAsGuest = () => {
    setIsLogged(false);
    setIsGuest(true);
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // Puedes manejar el error aquí
    }
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