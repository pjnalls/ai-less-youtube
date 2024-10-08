import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from 'nativewind';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export const ApiKeyContext = createContext({
  apiKey: '',
  setApiKey: () => {},
  isValidKey: undefined,
  setIsValidKey: () => {},
  timeAgo,
} as {
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  isValidKey: boolean | undefined | null;
  setIsValidKey: React.Dispatch<
    React.SetStateAction<boolean | undefined | null>
  >;
  timeAgo: TimeAgo;
});

function RootLayoutNav() {
  const colorScheme = useColorScheme().colorScheme;
  const [apiKey, setApiKey] = useState('');
  const [isValidKey, setIsValidKey] = useState<boolean | undefined | null>(
    undefined,
  );

  useEffect(() => {
    if (isValidKey) {
      router.navigate('/(tabs)/');
    } else {
      router.navigate('/(tabs)/access');
    }
  }, [isValidKey]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ApiKeyContext.Provider
        value={{ apiKey, setApiKey, isValidKey, setIsValidKey, timeAgo }}>
        <Stack>
          <Stack.Screen
            name='(tabs)'
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='modal'
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </ApiKeyContext.Provider>
    </ThemeProvider>
  );
}
