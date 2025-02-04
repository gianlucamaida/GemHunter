import { Attraction } from "@/constants/Attraction";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Icon from "react-native-vector-icons/FontAwesome";

interface ItineraryPoint {
  lat: number;
  lon: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface SimulatedHuntProps {
  attractions: Attraction[];
  itinerary: ItineraryPoint[];
  userLocation: UserLocation;
  onExit: () => void;
}

const SimulatedHunt: React.FC<SimulatedHuntProps> = ({
  attractions,
  itinerary,
  userLocation,
  onExit,
}) => {
  const [simulatedPosition, setSimulatedPosition] = useState(userLocation);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageMapping = {
    "mole_icon.jpg": require("../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../assets/images/testa_icon.jpg"),
  };

  useEffect(() => {
    if (!isMoving || currentIndex >= routeCoords.length) return;

    const timeout = setTimeout(() => {
      setSimulatedPosition(routeCoords[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [isMoving, currentIndex, routeCoords, speed]);

  const renderMarker = (attraction: Attraction) => {
    if (attraction.isGem === 0) {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          icon={imageMapping[attraction.icon as keyof typeof imageMapping]}
          pinColor="black"
        />
      );
    } else if (attraction.isGem === 1 && attraction.isFound === 1) {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          icon={imageMapping[attraction.icon as keyof typeof imageMapping]}
          pinColor="green"
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {attractions.map((attraction) => renderMarker(attraction))}
        <MapViewDirections
          origin={userLocation}
          waypoints={itinerary.map((point) => ({
            latitude: point.lat,
            longitude: point.lon,
          }))}
          destination={{
            latitude: itinerary[itinerary.length - 1].lat,
            longitude: itinerary[itinerary.length - 1].lon,
          }}
          apikey={"AIzaSyAhvPXWl8KO2Bc9v3pTEraAID7cq6zMMFo"}
          strokeWidth={2}
          strokeColor="#0039e6"
          mode="WALKING"
          lineDashPattern={[3]}
          onReady={(result) => {
            setRouteCoords(result.coordinates);
          }}
        />
        <Marker coordinate={simulatedPosition} title="User">
          <View style={styles.userMarker}>
            <View style={styles.innerCircle} />
          </View>
        </Marker>
      </MapView>

      <TouchableOpacity style={styles.startButton} onPress={() => setIsMoving(!isMoving)}>
        <Text style={styles.buttonText}>{isMoving ? "Pause" : "Start"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
        <Text style={styles.buttonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userMarker: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: "rgba(0, 122, 255, 0.3)", // Azzurro trasparente
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  innerCircle: {
    width: 18,
    height: 18,
    borderRadius: 15,
    backgroundColor: "#007AFF", // Azzurro di iOS/Google Maps
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  startButton: {
    position: "absolute",
    bottom: 100,
    left: 30,
    width: 100,
    height: 40,
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  exitButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "red",
    width: 100,
    height: 40,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SimulatedHunt;
