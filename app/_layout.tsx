import {DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider} from '@react-navigation/native';
import {Stack, useRouter, useSegments} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';
import '../global.css';

import {ThemeProvider, useTheme} from '@/contexts/ThemeContext';
import {LanguageProvider} from '@/contexts/LanguageContext';
import {PaperLightTheme, PaperDarkTheme} from '@/constants/paper-theme';
import {storage} from '@/utils/storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const {theme, isDark} = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await storage.getUser();
    setIsReady(true);
    
    // Public routes that don't require auth
    const publicRoutes = ['login', 'register'];
    const currentRoute = segments[0] || 'login';
    
    // If user is logged in and on login/register, redirect to tabs
    if (user && (currentRoute === 'login' || currentRoute === 'register')) {
      router.replace('/(tabs)');
    }
    // If user is not logged in and trying to access protected routes, redirect to login
    else if (!user && !publicRoutes.includes(currentRoute)) {
      router.replace('/login');
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <PaperProvider theme={isDark ? PaperDarkTheme : PaperLightTheme}>
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{headerShown: false}} />
          <Stack.Screen name="register" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          <Stack.Screen
            name="book/[id]"
            options={{title: 'Detail Buku', headerShown: true}}
          />
          <Stack.Screen
            name="settings"
            options={{title: 'Settings', headerShown: true}}
          />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}
