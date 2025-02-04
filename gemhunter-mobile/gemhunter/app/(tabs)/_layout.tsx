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
        tabBarActiveTintColor: "white",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#000", // Background forzato su nero
          position: Platform.OS === "ios" ? "absolute" : "relative",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />

      {/* Aggiungi il Tab per creare un itinerario */}
      <Tabs.Screen
        name="create_itinerary"
        options={{
          title: "New Itinerary",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="location" color={color} />,
        }}
      />

      {/* Aggiungi il Tab per AddGem */}
      <Tabs.Screen
        name="add_gem"
        options={{
          title: "Add Gem",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.app" color={color} />,
        }}
      />

      {/* Aggiungi il Tab per la deck page */}
      <Tabs.Screen
        name="deck_page"
        options={{
          title: "Deck",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book" color={color} />,
        }}
      />

      {/* Aggiungi il Tab per la profile page */}
      <Tabs.Screen
        name="profile_page"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
