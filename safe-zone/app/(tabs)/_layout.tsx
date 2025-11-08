import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PropertyProvider } from '@/contexts/PropertyContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PropertyProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Maps',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Checklist',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.square.fill" color={color} />,
          }}
        />
      </Tabs>
    </PropertyProvider>
  );
}
