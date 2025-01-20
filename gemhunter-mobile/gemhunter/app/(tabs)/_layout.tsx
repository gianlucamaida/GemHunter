import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint, // Colore attivo
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "black", // Colore viola desiderato per la barra
          position: Platform.OS === 'ios' ? 'absolute' : 'relative', // Posizione della barra
          borderTopWidth: 0, // Rimuove il bordo superiore della tab bar
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="mainpage"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />

      {/* Aggiungi il Tab per AddGem */}
      <Tabs.Screen
        name="addgem"
        options={{
          title: "Add Gem",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus" color={color} />,
        }}
      />

    </Tabs>
  );
}
