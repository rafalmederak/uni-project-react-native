import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DataProvider } from '@/app/DataContext';
import Albums from './albums'; // Import komponentu Albums

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <DataProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="photos"
          options={{
            title: 'Photos',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'image' : 'image-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="albums" // Dodaj nową zakładkę dla Albums
          options={{
            title: 'Albums',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'albums' : 'albums-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </DataProvider>
  );
}