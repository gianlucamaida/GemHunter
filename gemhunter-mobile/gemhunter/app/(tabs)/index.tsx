import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ScrollView,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import SimulatedHunt from "@/components/SimulatedHunt";
import { Attraction } from "@/constants/Attraction";
import { getAttractions } from "@/dao/attractionsDao";
import MapViewDirections from "react-native-maps-directions";
import PopupStartHunt from "@/components/PopupStartHunt";
import InfoButton from "@/components/InfoButton";
import SimulatedHunt2 from "@/components/SimulatedHunt2";
import { useIsFocused } from "@react-navigation/native";
import { DEFAULT_ICON_SIZE } from "@expo/vector-icons/build/createIconSet";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<String | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const { itinerary } = useLocalSearchParams();
  const { count } = useLocalSearchParams();
  const parsedItinerary = typeof itinerary === "string" ? JSON.parse(itinerary) : null;
  const [itineraryState, setItineraryState] = useState<Attraction[] | null>(null);
  const [simulation, setSimulation] = useState(false);
  const [exitPressed, setExitPressed] = useState(false);

  const [huntMode, setHuntMode] = useState(false);
  const [showStartHuntButton, setShowStartHuntButton] = useState(true);
  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
    "diavolo_icon.jpg": require("../../assets/images/diavolo_icon.jpg"),
    "piercing_icon.jpg": require("../../assets/images/piercing_icon.jpg"),
    "piazza-san-carlo.jpg": require("../../assets/images/piazza-san-carlo.jpg"),
    "fetta-polenta.jpg": require("../../assets/images/fetta-polenta.jpg"),
    "portone-melograno.jpg": require("../../assets/images/portone-melograno.jpg"),
    "monumento-vittorio.jpg": require("../../assets/images/monumento-vittorio.jpg"),
  };

  const isFocus = useIsFocused();

  useEffect(() => {
    setAttractions(parsedItinerary);
    setItineraryState(parsedItinerary);
  }, [itinerary, count]);

  const handleStartHunt = () => {
    setHuntMode(true);
    setShowStartHuntButton(false);
    setAttractions(allAttractions);
  };

  const handleStartSimulation = () => {
    setSimulation(true);
  };

  const handleBackHuntButton = () => {
    setHuntMode(false);
    setShowStartHuntButton(true);
    setAttractions(allAttractions.filter((attraction) => attraction.isFound === 1));
  };

  const handleExitSimulatedHunt = () => {
    setHuntMode(false);
    setItineraryState(null);
    setShowStartHuntButton(true);
    setAttractions(allAttractions.filter((attraction) => attraction.isFound === 1));
    setSimulation(false);
    setExitPressed(!exitPressed);
  };

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        if (isFocus && !huntMode) {
          const results = await getAttractions();
          setAttractions(results.filter((attraction: Attraction) => attraction.isFound === 1));
          setAllAttractions(results);
        }
      } catch (error) {
        console.error("Failed to load attractions:", error);
      }
    };
    loadAttractions();
  }, [isFocus, exitPressed]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      setErrorMsg("Unable to fetch location. Please try again.");
      console.error(error);
    }
  };

  const openModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setModalVisible(true);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!userLocation || !attractions) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
            image={require("../../assets/images/gem_center.png")}
            onPress={() => openModal(attraction)}
          />
        </>
      );
    } else if (attraction.isGem === 0) {
      return (
        <Marker
          key={`marker-${attraction.id}`} // <== AGGIUNGI key UNIVOCO
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          image={require("../../assets/images/monument.png")}
          onPress={() => openModal(attraction)}
        />
      );
    } else if (attraction.isGem === 1 && attraction.isFound === 1) {
      return (
        <Marker
          key={`marker-${attraction.id}`} // <== AGGIUNGI key UNIVOCO
          coordinate={{ latitude: attraction.lat, longitude: attraction.lon }}
          image={require("../../assets/images/gem_marker.png")}
          onPress={() => openModal(attraction)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {itineraryState ? (
        <SimulatedHunt
          attractions={itineraryState}
          itinerary={itineraryState}
          userLocation={userLocation}
          onExit={handleExitSimulatedHunt}
        />
      ) : (
        <>
          {showStartHuntButton && <InfoButton />}

          {simulation ? (
            <SimulatedHunt2
              attractions={attractions}
              itinerary={attractions
                .filter((attraction) => attraction.isFound === 0 && attraction.isGem === 1)
                .slice(0, 1)}
              userLocation={userLocation}
              onExit={handleExitSimulatedHunt}
            />
          ) : (
            <>
              <MapView
                key={attractions.length}
                style={styles.map}
                initialRegion={{
                  latitude: 45.0703,
                  longitude: 7.6869,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                showsCompass={false}
              >
                {attractions.map((attraction) => (
                  <React.Fragment key={attraction.id}>{renderMarker(attraction)}</React.Fragment>
                ))}

                {userLocation && itineraryState && (
                  <MapViewDirections
                    origin={userLocation}
                    waypoints={parsedItinerary.map((attraction: Attraction) => ({
                      latitude: attraction.lat,
                      longitude: attraction.lon,
                    }))}
                    destination={{
                      latitude: parsedItinerary[parsedItinerary.length - 1].lat,
                      longitude: parsedItinerary[parsedItinerary.length - 1].lon,
                    }}
                    apikey={"AIzaSyAhvPXWl8KO2Bc9v3pTEraAID7cq6zMMFo"}
                    strokeWidth={2}
                    strokeColor="#0039e6"
                    mode="WALKING"
                    lineDashPattern={[3]}
                  />
                )}
              </MapView>

              {!showStartHuntButton && (
                <>
                  <TouchableOpacity style={styles.backButton} onPress={handleBackHuntButton}>
                    <Text style={styles.backButtonText}>←</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleStartSimulation}>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>Start Simulation</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  {selectedAttraction &&
                    selectedAttraction.isFound === 1 &&
                    selectedAttraction.isGem === 0 && (
                      <View style={styles.modalContent}>
                        <Image
                          source={
                            imageMapping[selectedAttraction.icon as keyof typeof imageMapping]
                          }
                          style={styles.attractionImage}
                        />
                        <Text style={styles.attractionTitle}>{selectedAttraction.name}</Text>
                        <View style={styles.descriptionContainer}>
                          <ScrollView style={styles.descriptionScroll}>
                            <Text style={styles.attractionDescription}>
                              {selectedAttraction.description.replace(/\\'/g, "'")}
                            </Text>
                          </ScrollView>
                        </View>
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  {selectedAttraction &&
                    selectedAttraction.isFound === 1 &&
                    selectedAttraction.isGem === 1 && (
                      <View style={styles.modalContentGemFound}>
                        <ImageBackground
                          source={require("../../assets/images/gem_background4.png")}
                          style={styles.modalBackgroundImage}
                          imageStyle={{ borderRadius: 20 }}
                        >
                          <Image
                            source={
                              imageMapping[selectedAttraction.icon as keyof typeof imageMapping]
                            }
                            style={styles.attractionImage}
                          />
                          <Text style={styles.attractionTitle}>{selectedAttraction.name}</Text>
                          <View style={styles.descriptionContainer}>
                            <ScrollView style={styles.descriptionScroll}>
                              <Text style={styles.attractionDescription}>
                                {selectedAttraction.description.replace(/\\'/g, "'")}
                              </Text>
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

                  {selectedAttraction &&
                    selectedAttraction.isFound === 0 &&
                    selectedAttraction.isGem === 0 && (
                      <View style={styles.modalContent}>
                        <View style={styles.imageContainer}>
                          <Image
                            source={
                              imageMapping[selectedAttraction.icon as keyof typeof imageMapping]
                            }
                            style={styles.attractionImage}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.questionMarks}>???</Text>
                          </View>
                        </View>

                        <Text style={styles.attractionTitle}>???</Text>

                        <View style={styles.descriptionContainer}>
                          <Text style={styles.attractionDescription}>
                            {"The selected attraction has not been found yet."}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  {selectedAttraction &&
                    selectedAttraction.isFound === 0 &&
                    selectedAttraction.isGem === 1 && (
                      <View style={styles.modalContentGemFound}>
                        <ImageBackground
                          source={require("../../assets/images/gem_background4.png")}
                          style={styles.modalBackgroundImage}
                          imageStyle={{ borderRadius: 20 }}
                        >
                          <View style={styles.imageContainer}>
                            <Image
                              source={
                                imageMapping[selectedAttraction.icon as keyof typeof imageMapping]
                              }
                              style={styles.attractionImage}
                            />
                            <View style={styles.overlay}>
                              <Text style={styles.questionMarks}>???</Text>
                            </View>
                          </View>
                          <Text style={styles.attractionTitle}>???</Text>
                          <View style={styles.descriptionContainer}>
                            <Text style={styles.attractionDescription}>
                              {"The selected gem has not been found yet."}
                            </Text>
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
                </View>
              </Modal>

              {showStartHuntButton && (
                <TouchableOpacity onPress={handleStartHunt}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Start Hunt</Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 150,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(24, 21, 21, 0.97)", // Sfondo nero semi-trasparente
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  questionMarks: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  questionMark: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  imageBlurred: {
    opacity: 0.3,
  },
  stepImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
    margin: 20,
    resizeMode: "contain",
    overflow: "hidden",
  },
  stepImageinside: {
    width: "100%",
    height: "100%",
  },
  attractionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    margin: 20,
  },
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "black",
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 70,
    right: 70,
    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContentGemFound: {
    width: "85%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
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
  closeButton: {
    width: "80%",
    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4,
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
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  descriptionScroll: {
    maxHeight: 200,
  },
  attractionDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    margin: 20,
  },
});
