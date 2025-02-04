import { Attraction } from "@/constants/Attraction";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [speed, setSpeed] = useState(1000); // Velocità in millisecondi
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const imageMapping = {
    "mole_icon.jpg": require("../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../assets/images/testa_icon.jpg"),
  };

  const FAKE_COORDS = [{ latitude: 45.0505366, longitude: 7.6812146 }];

  useEffect(() => {
    if (!isMoving || currentIndex >= routeCoords.length) return;

    const timeout = setTimeout(() => {
      setSimulatedPosition(routeCoords[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [isMoving, currentIndex, routeCoords, speed]);

  useEffect(() => {
    if (
      simulatedPosition.latitude === FAKE_COORDS.at(0)?.latitude &&
      simulatedPosition.longitude === FAKE_COORDS.at(0)?.longitude
    ) {
      setShowModal(true);
    }
  }, [simulatedPosition]);

  // Funzione per rendere il marker per ogni attrazione
  const renderMarker = (attraction: Attraction) => {
    if (attraction.isGem === 0) {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          icon={imageMapping[attraction.icon as keyof typeof imageMapping]} // L'icona personalizzata per il marker
          //onPress={() => openModal(attraction)}
          pinColor="black"
        />
      );
    } else if (attraction.isGem === 1 && attraction.isFound === 1) {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          icon={imageMapping[attraction.icon as keyof typeof imageMapping]} // L'icona personalizzata per il marker
          //onPress={() => openModal(attraction)}
          pinColor="green"
        />
      );
    }
  };

  // Funzione per aprire il modal
  //   const openModal = (attraction: Attraction) => {
  //     // setModalVisible(true);
  //   };

  return (
    <View style={styles.container}>
      {showModal && (
        <Modal>
          <View>
            <Text>Modal</Text>
          </View>
        </Modal>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Renderizza i marker per le attrazioni */}
        {attractions.map((attraction) => renderMarker(attraction))}

        <MapViewDirections
          origin={userLocation}
          waypoints={FAKE_COORDS}
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

        {/* Marker della posizione simulata */}
        <Marker coordinate={simulatedPosition} title="User" />
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
