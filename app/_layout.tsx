import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DataProvider, DataContext } from "./DataContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Login from "./login";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DataProvider>
        <RootContentWrapper />
      </DataProvider>
    </ThemeProvider>
  );
};

const RootContentWrapper = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/(tabs)");
    }
  }, [currentUser, router]);

  return currentUser ? <RootContent /> : <Login />;
};

const RootContent = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default RootLayout;
