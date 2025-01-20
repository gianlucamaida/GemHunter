import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps"; // Importa i componenti di react-native-maps
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

import { Attraction } from "@/constants/Attraction"; // Assicurati che Attraction sia definito correttamente
import { useDatabase } from "@/hooks/useDatabase";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const { getAttractions } = useDatabase(); // Usa il hook per ottenere le attrazioni
  const navigation = useNavigation<any>();

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const results = await getAttractions(); // Ottieni le attrazioni dal database
        setAttractions(results); // Imposta le attrazioni nello state
      } catch (error) {
        console.error("Failed to load attractions:", error);
      }
    };

    loadAttractions();
  }, []);

  // Funzione per ottenere la posizione
  const getUserLocation = async () => {
    try {
      // Richiedi permessi per la geolocalizzazione
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      // Ottieni la posizione corrente
      const location = await Location.getCurrentPositionAsync({});
      console.log("User Location:", location); // Log per verificare la posizione
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setErrorMsg("Unable to fetch location. Please try again.");
      console.error(error);
    }
  };

  // Esegui la funzione al montaggio del componente
  useEffect(() => {
    getUserLocation();
  }, []);

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Funzione per rendere il marker per ogni attrazione
  const renderMarker = (attraction: Attraction) => {
    if (attraction.isGem === 1) {
      return (
        <Circle
          key={attraction.id}
          center={{ latitude: attraction.lat, longitude: attraction.lon }}
          radius={300}
          strokeColor="darkgreen"
          fillColor="rgba(0, 128, 0, 0.6)"
        />
      );
    } else {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          title="Attraction"
          description="Check out this place!"
          icon={{ uri: attraction.icon }} // L'icona personalizzata per il marker
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Mappa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.0703,
          longitude: 7.6869,
          latitudeDelta: 0.05, // Zoom
          longitudeDelta: 0.05, // Zoom
        }}
        showsUserLocation={true}
        followsUserLocation={true} // La mappa segue automaticamente la posizione dell'utente
      >
        {/* Renderizza i marker per le attrazioni */}
        {attractions.map((attraction) => renderMarker(attraction))}

        {/* Marker per la posizione dell'utente */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
          />
        )}
      </MapView>

      {/* Bottone Start Hunt */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("FreeRoam")}>
          <Text style={styles.buttonText}>Start Hunt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 70,
    left: 70,
    right: 70,
    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4, // Per ombre su Android
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white", // Cambia il colore del testo a bianco
    fontSize: 16, // Puoi anche regolare la dimensione del testo
    fontWeight: "bold", // Testo in grassetto (opzionale)
  },
});
