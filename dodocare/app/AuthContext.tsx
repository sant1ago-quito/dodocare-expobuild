// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de importar tu db

export type Role = 'guest' | 'user' | 'admin';

export type AuthContextType = {
  user: User | null;
  role: Role;
  isLogged: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'guest',
  isLogged: false,
  login: async () => {},
  loginAdmin: async () => false,
  loginAsGuest: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Buscar el rol en Firestore
        try {
          const userDoc = await getDoc(doc(db, 'pacientes', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            let role = data.role;
            if (role === 'invitado') role = 'guest';
            setRole(role as Role);
          } else {
            setRole('user');
          }
        } catch (error) {
          setRole('user');
        }
        setIsLogged(true);
      } else {
        setUser(null);
        setRole('guest');
        setIsLogged(false);
      }
    });
    return unsubscribe;
  }, []);

  // Login usuario normal
  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);

      // Buscar el rol en Firestore
      const userDoc = await getDoc(doc(db, 'pacientes', result.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        let role = data.role;
        if (role === 'invitado') role = 'guest'; // Traduce 'invitado' a 'guest'
        setRole(role as Role);
      } else {
        setRole('user'); // Por defecto si no existe el documento
      }

      setIsLogged(true);
    } catch (error) {
      setIsLogged(false);
      throw error;
    }
  };

  // Login admin
  const loginAdmin = async (email: string, password: string) => {
    if (email === 'cristian503md5@gmail.com' && password === '123456') {
      setUser({} as User); // Simulación de usuario admin
      setRole('admin');
      setIsLogged(true);
      return true;
    }
    return false;
  };

  // Login invitado
  const loginAsGuest = () => {
    setUser(null);
    setRole('guest');
    setIsLogged(false);
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
    setUser(null);
    setRole('guest');
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isLogged, login, loginAdmin, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
