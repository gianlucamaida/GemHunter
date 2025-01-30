import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  Image,
  ImageBackground,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Attraction } from "@/constants/Attraction";
import { getAttractions } from "@/dao/attractionsDao";
import MapView, { Marker, Circle } from "react-native-maps";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null); // Attrazione selezionata
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null); // Modifica tipo in base alla struttura che desideri
  const [totalTime, setTotalTime] = useState<string>(""); // Tempo disponibile
  const [maxAttractions, setMaxAttractions] = useState<string>(""); // Numero massimo di attrazioni
  const [maxGems, setMaxGems] = useState<string>(""); // Numero massimo di gemme
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false); // Flag per il form
  const [formErrors, setFormErrors] = useState<string[]>([]); // Per raccogliere gli errori di validazione
  const navigation = useNavigation();

  const PATH1 = attractions;
  const PATH2 = attractions.slice(0, 3);
  const PATH3 = attractions.slice(3, 5);

  useEffect(() => {
    const loadAttractions = async () => {
      const results = await getAttractions();
      //console.log("Loaded Attractions EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE:", results);
      setAttractions(results); // Imposta le attrazioni nello state
    };
    loadAttractions();
  }, []);

  useEffect(() => {
    // Recupera la posizione dell'utente al montaggio del componente
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert("Permission to access location was denied.");
      }
    };

    getUserLocation();
  }, []);

  // Funzione di validazione
  const validateForm = (): boolean => {
    const errors: string[] = [];
    // Controllo che i campi siano compilati
    if (!totalTime || isNaN(Number(totalTime)) || Number(totalTime) <= 0) {
      errors.push("Please enter a valid total time.");
    }
    if (!maxAttractions || isNaN(Number(maxAttractions)) || Number(maxAttractions) <= 0) {
      errors.push("Please enter a valid number of attractions.");
    }
    if (!maxGems || isNaN(Number(maxGems)) || Number(maxGems) <= 0) {
      errors.push("Please enter a valid number of gems.");
    }

    if (errors.length > 0) {
      Alert.alert("Error", errors.join("\n"));
      return false;
    }

    return true;
  };

  // Funzione di submit
  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      setFormSubmitted(true); // Procedi con l'invio del form
      // Qui puoi implementare la logica per calcolare l'itinerario
    }
  };

  // Funzione per aprire il modal
  const openModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setModalVisible(true);
  };

  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
  };

  // Funzione per rendere il marker per ogni attrazione
  const renderMarker = (attraction: Attraction) => {
    //console.log(attraction);
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
    <>
      {!formSubmitted && (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Text style={styles.title}>Create your itinerary!</Text>

            {/* Messaggi di errore */}
            {formErrors.length > 0 && (
              <View style={styles.errorContainer}>
                {formErrors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>
                    {error}
                  </Text>
                ))}
              </View>
            )}

            {/* Form per inserire i dati */}
            {!formSubmitted && (
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Avaiable Time (minutes)"
                  value={totalTime}
                  onChangeText={setTotalTime}
                  keyboardType="numeric"
                  placeholderTextColor="#666" // Colore più scuro per il placeholder
                />
                <TextInput
                  style={styles.input}
                  placeholder="Number of Attractions to see"
                  value={maxAttractions}
                  onChangeText={setMaxAttractions}
                  keyboardType="numeric"
                  placeholderTextColor="#666" // Colore più scuro per il placeholder
                />
                <TextInput
                  style={styles.input}
                  placeholder="Number of Gems to see"
                  value={maxGems}
                  onChangeText={setMaxGems}
                  keyboardType="numeric"
                  placeholderTextColor="#666" // Colore più scuro per il placeholder
                />

                {/* Bottone per inviare il form */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}

      {formSubmitted && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setFormSubmitted(false)} // Imposta formSubmitted a false
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

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
                      <Text style={styles.attractionDescription}>
                        {selectedAttraction.description}
                      </Text>
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
                      <Text style={styles.attractionDescription}>
                        {selectedAttraction.description}
                      </Text>
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
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </>
                </View>
              )}
            </View>
          </Modal>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  form: {
    marginTop: 25,
    marginBottom: 30,
    width: "80%",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 4,
  },
  inputPlaceholder: {
    color: "#666", // Colore più scuro per il placeholder
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center", // Centra il bottone
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    paddingLeft: 70,
    paddingRight: 70,
    borderRadius: 30,
    justifyContent: "center", // Centra il contenuto all'interno del bottone
    alignItems: "center", // Centra il contenuto orizzontalmente
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Centra il testo all'interno
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
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
  attractionDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
    paddingInline: 30,
  },
  closeButton: {
    width: "80%",
    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4, // Per ombre su Android
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40, // Distanza dal bordo superiore
    left: 20, // Distanza dal bordo sinistro
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    zIndex: 1, // Assicurati che il pulsante stia sopra la mappa
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
