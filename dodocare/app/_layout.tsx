import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from './AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pantalla de redirección inicial (index.tsx) */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            animation: 'fade' 
          }} 
        />

        {/* Pantalla principal con botones (login.tsx) */}
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }} 
        />

        {/* Formulario de inicio de sesión */}
        <Stack.Screen 
          name="login-form" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />

        {/* Pantalla de registro */}
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }} 
        />

        {/* Área principal después del login */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'fade'
          }} 
        />

        {/* Pantalla 404 */}
        <Stack.Screen 
          name="+not-found" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}