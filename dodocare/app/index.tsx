import { useEffect } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login'); // Asegúrate de que esta ruta coincide con tu Stack.Screen
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return <ActivityIndicator size="large" color="#4CAF50" />;
}