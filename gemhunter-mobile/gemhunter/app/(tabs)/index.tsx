import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ScrollView ,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps"; // Importa i componenti di react-native-maps
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

import { Attraction } from "@/constants/Attraction"; // Assicurati che Attraction sia definito correttamente
import { getAttractions } from "@/dao/attractionsDao";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<String | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null); // Attrazione selezionata
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();

  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
  };

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const results = await getAttractions();
        // console.log(results);
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

  // Funzione per aprire il modal
  const openModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setModalVisible(true);
  };

  // Esegui la funzione al montaggio del componente
  useEffect(() => {
    getUserLocation();
  }, []);

  if (!userLocation || attractions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Funzione per rendere il marker per ogni attrazione
  const renderMarker = (attraction: Attraction) => {
    console.log(attraction);
    if (attraction.isGem === 1 && attraction.isFound === 0) {
      return (
        <Circle
          key={attraction.id}
          center={{ latitude: attraction.lat, longitude: attraction.lon }}
          radius={300}
          strokeColor="darkgreen"
          fillColor="rgba(0, 128, 0, 0.6)"
        />
      );
    } else if (attraction.isGem === 0) {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          icon={imageMapping[attraction.icon as keyof typeof imageMapping]} // L'icona personalizzata per il marker
          onPress={() => openModal(attraction)}
          pinColor="black"
        />
      );
    } else if (attraction.isGem === 1 && attraction.isFound === 1) {
      return (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          icon={imageMapping[attraction.icon as keyof typeof imageMapping]} // L'icona personalizzata per il marker
          onPress={() => openModal(attraction)}
          pinColor="green"
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
      >
        {/* Renderizza i marker per le attrazioni */}
        {attractions.map((attraction) => renderMarker(attraction))}
      </MapView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* attrazione trovata */}
          {selectedAttraction &&
            selectedAttraction.isFound === 1 &&
            selectedAttraction.isGem === 0 && (
              <View style={styles.modalContent}>
                <>
                  <Image
                    source={imageMapping[selectedAttraction.icon as keyof typeof imageMapping]}
                    style={styles.attractionImage}
                  />
                  <Text style={styles.attractionTitle}>{selectedAttraction.name}</Text>
                  <View style={styles.descriptionContainer}>
                    <ScrollView style={styles.descriptionScroll}>
                      <Text style={styles.attractionDescription}>{selectedAttraction.description.replace(/\\'/g, "'")}</Text>
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              </View>
            )}
          {/* Gemma trovata */}
          {selectedAttraction &&
            selectedAttraction.isFound === 1 &&
            selectedAttraction.isGem === 1 && (
              <View style={styles.modalContentGemFound}>
                <ImageBackground
                  source={require("../../assets/images/gem_background4.png")}
                  style={styles.modalBackgroundImage}
                  imageStyle={{ borderRadius: 20 }} // Per arrotondare i bordi dell'immagine
                >
                  <Image
                    source={imageMapping[selectedAttraction.icon as keyof typeof imageMapping]}
                    style={styles.attractionImage}
                  />
                  <Text style={styles.attractionTitle}>{selectedAttraction.name}</Text>
                  <View style={styles.descriptionContainer}>
                    <ScrollView style={styles.descriptionScroll}>
                      <Text style={styles.attractionDescription}>{selectedAttraction.description.replace(/\\'/g, "'")}</Text>
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            )}
          {/* attrazione non trovata */}
          {selectedAttraction && selectedAttraction.isFound === 0 && (
            <View style={styles.modalContent}>
              <>
                <Text style={styles.attractionDescription}>
                  {"The selected attraction has not been found yet."}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            </View>
          )}
        </View>
      </Modal>

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
    bottom: 100,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Sfondo scuro semi-trasparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5, // Ombra per Android
    shadowColor: "#000", // Ombra per iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContentGemFound: {
    width: "85%",
    borderRadius: 20,
    overflow: "hidden", // Necessario per far sì che i bordi arrotondati vengano applicati correttamente all'ImageBackground
    elevation: 5, // Ombra per Android
    shadowColor: "#000", // Ombra per iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  modalBackgroundImage: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  attractionImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  attractionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  closeButton: {
    width: "80%",
    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4, // Per ombre su Android
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionContainer: {
    borderWidth: 2, // Spessore del bordo
    borderColor: "gray", // Colore del bordo
    borderRadius: 10, // Arrotondamento degli angoli
    padding: 10, // Spazio interno tra il testo e il bordo
    marginBottom: 15, // Distanza dagli altri elementi
    backgroundColor: "white", // Sfondo per contrastare con il testo
  },
  descriptionScroll: {
    maxHeight: 200, // Altezza massima prima che scatti lo scroll
  },
  attractionDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    margin: 5,
  },
});
