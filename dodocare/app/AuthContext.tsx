// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

type AuthContextType = {
  user: User | null;
  isGuest: boolean;
  isLogged: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  isLogged: false,
  login: async () => {},
  loginAsGuest: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // Mantener sesión activa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLogged(true);
        setIsGuest(false);
      } else {
        setUser(null);
        setIsLogged(false);
        setIsGuest(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email?: string, password?: string) => {
    if (email && password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
        setIsLogged(true);
        setIsGuest(false);
      } catch (error) {
        setIsLogged(false);
        throw error;
      }
    } else {
      throw new Error('Email y contraseña requeridos');
    }
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    setIsLogged(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
    setUser(null);
    setIsLogged(false);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, isLogged, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
