import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

interface ItineraryPoint {
  lat: number;
  lon: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface SimulatedHuntProps {
  itinerary: ItineraryPoint[];
  userLocation: UserLocation;
  onExit: () => void;
}

const SimulatedHunt: React.FC<SimulatedHuntProps> = ({ itinerary, userLocation, onExit }) => {
  const [simulatedPosition, setSimulatedPosition] = useState(userLocation);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [speed, setSpeed] = useState(100); // Velocità in millisecondi
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let index = 0;
    const moveAlongRoute = () => {
      if (index < routeCoords.length) {
        setSimulatedPosition(routeCoords[index]);
        index++;
        timeoutRef.current = setTimeout(moveAlongRoute, speed); // Ritardo controllato dalla velocità
      } else {
        setIsMoving(false);
      }
    };

    if (isMoving) {
      moveAlongRoute();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isMoving, routeCoords, speed]);

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
          strokeWidth={3}
          strokeColor="#0039e6"
          onReady={(result) => {
            setRouteCoords(result.coordinates);
          }}
        />

        {/* Marker della posizione simulata */}
        <Marker coordinate={simulatedPosition} title="User" />
      </MapView>

      <TouchableOpacity style={styles.startButton} onPress={() => setIsMoving(true)}>
        <Text style={styles.buttonText}>Start Simulated Hunt</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
        <Text style={styles.buttonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  startButton: {
    position: "absolute",
    bottom: 100,
    left: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  exitButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SimulatedHunt;
