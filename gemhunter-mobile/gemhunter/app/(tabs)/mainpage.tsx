import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps"; // Importa i componenti di react-native-maps
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

interface Attraction {
  id: number;
  lat: number;
  lon: number;
  isGem: number;
  icon: string;
}

interface MainPageProps {
  attractions: Attraction[];
}

export default function MainPage({ attractions }: MainPageProps) {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const navigation = useNavigation<any>();

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
        {/* Marker per attrazioni */}
        {/* {attractions.map((attraction) => renderMarker(attraction))} */}
        {/* do not consider it for now as we have no db with attractions and no api call */}

        {/* Marker per la posizione dell'utente */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            // icon={require("../../assets/icons/icon_walking_Man.png")} // Icona personalizzata
          />
        )}
      </MapView>

      {/* Bottone Start Hunt */}
      <View style={styles.buttonContainer}>
        <Button
          title="Start Hunt"
          onPress={() => navigation.navigate("FreeRoam")} // Navigazione verso un'altra pagina
        />
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
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4, // Per ombre su Android
    padding: 10,
  },
});
