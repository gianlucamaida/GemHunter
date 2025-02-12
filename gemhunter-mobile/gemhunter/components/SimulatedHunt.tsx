import { Attraction } from "@/constants/Attraction";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Progress from "react-native-progress";
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
  const [speed, setSpeed] = useState(200);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedStops, setCompletedStops] = useState(0);
  const [visitedPoints, setVisitedPoints] = useState<Set<number>>(new Set());
  const previousPosition = useRef(userLocation);

  const imageMapping = {
    "mole_icon.jpg": require("../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../assets/images/testa_icon.jpg"),
    "piazza-san-carlo.jpg": require("../assets/images/piazza-san-carlo.jpg"),
    "fetta-polenta.jpg": require("../assets/images/fetta-polenta.jpg"),
    "portone-melograno.jpg": require("../assets/images/portone-melograno.jpg"),
    "monumento-vittorio.jpg": require("../assets/images/monumento-vittorio.jpg"),
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const isPointBetweenPositions = (
    point: ItineraryPoint,
    prevPos: { latitude: number; longitude: number },
    currentPos: { latitude: number; longitude: number }
  ) => {
    // Calcola le distanze
    const distanceTotal = calculateDistance(
      prevPos.latitude,
      prevPos.longitude,
      currentPos.latitude,
      currentPos.longitude
    );
    const distanceToStart = calculateDistance(
      point.lat,
      point.lon,
      prevPos.latitude,
      prevPos.longitude
    );
    const distanceToEnd = calculateDistance(
      point.lat,
      point.lon,
      currentPos.latitude,
      currentPos.longitude
    );
    // Margine di errore (35 metri)
    const margin = 50;
    // Controlla se il punto è vicino al segmento di percorso
    return (
      distanceToStart < margin ||
      distanceToEnd < margin ||
      distanceToStart + distanceToEnd <= distanceTotal + margin
    );
  };

  useEffect(() => {
    if (!isMoving || currentIndex >= routeCoords.length) return;

    const timeout = setTimeout(() => {
      const newPosition = routeCoords[currentIndex];
      setSimulatedPosition(newPosition);

      itinerary.forEach((point, index) => {
        if (!visitedPoints.has(index)) {
          // Verifica se il punto è tra la posizione precedente e quella attuale
          if (isPointBetweenPositions(point, previousPosition.current, newPosition)) {
            setVisitedPoints((prev) => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });
            setCompletedStops((prev) => prev + 1);
            console.log(`Punto ${index} trovato! Coordinate: ${point.lat}, ${point.lon}`);
          }
        }
      });

      previousPosition.current = newPosition;
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [isMoving, currentIndex, routeCoords, speed]);

  const renderMarker = (attraction: Attraction) => {
    if (attraction.isGem === 1 && attraction.isFound === 0) {
      return (
        <>
          <Circle
            key={`circle-${attraction.id}`} // <== AGGIUNGI key UNIVOCO
            center={{ latitude: attraction.lat, longitude: attraction.lon }}
            radius={300}
            strokeColor="darkgreen"
            fillColor="rgba(0, 128, 0, 0.6)"
          />
          <Marker
            key={`marker-${attraction.id}`} // <== AGGIUNGI key UNIVOCO
            coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
            image={require("../assets/images/gem_center.png")}
          />
        </>
      );
    } else if (attraction.isGem === 0) {
      return (
        <Marker
          key={`marker-${attraction.id}`} // <== AGGIUNGI key UNIVOCO
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          image={require("../assets/images/monument.png")}
        />
      );
    } else if (attraction.isGem === 1 && attraction.isFound === 1) {
      return (
        <Marker
          key={`marker-${attraction.id}`} // <== AGGIUNGI key UNIVOCO
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          image={require("../assets/images/gem_marker.png")}
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
        showsCompass={false}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Stops Completed: {completedStops} / {itinerary.length}
          </Text>
          <Progress.Bar
            progress={completedStops / itinerary.length}
            width={160}
            height={10}
            color="white"
            borderWidth={1}
            borderColor="white"
            borderRadius={10}
          />
        </View>
        {attractions.map((attraction) => (
          <React.Fragment key={attraction.id}>{renderMarker(attraction)}</React.Fragment>
        ))}
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
          optimizeWaypoints={true}
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
  progressContainer: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 12,
  },
  progressText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
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
    borderRadius: 30,
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
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SimulatedHunt;
