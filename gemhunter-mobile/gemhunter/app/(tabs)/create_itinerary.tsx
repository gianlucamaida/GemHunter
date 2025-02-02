import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Attraction } from "@/constants/Attraction";
import { getAttractions } from "@/dao/attractionsDao";
import MapView, { Marker, Circle } from "react-native-maps";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [totalTime, setTotalTime] = useState<string>("");
  const [maxAttractions, setMaxAttractions] = useState<string>("");
  const [maxGems, setMaxGems] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const navigation = useNavigation();
  const [itinerary, setItinerary] = useState<Attraction[]>();
  const router = useRouter();
  const PATH1 = attractions;
  const PATH2 = attractions.slice(0, 3);
  const PATH3 = attractions.slice(3, 5);
  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
  };

  useEffect(() => {
    const loadAttractions = async () => {
      const results = await getAttractions();
      setAttractions(results);
    };
    loadAttractions();
  }, []);

  useEffect(() => {
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

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!totalTime || isNaN(Number(totalTime)) || Number(totalTime) <= 0) {
      errors.push("Please enter a valid total time.");
    }
    if (!maxAttractions || isNaN(Number(maxAttractions)) || Number(maxAttractions) < 0) {
      errors.push("Please enter a valid number of attractions.");
    }
    if (!maxGems || isNaN(Number(maxGems)) || Number(maxGems) < 0) {
      errors.push("Please enter a valid number of gems.");
    }

    if (errors.length > 0) {
      Alert.alert("Error", errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      if (Number(maxAttractions) === 3 && Number(maxGems) === 2) {
        setItinerary(PATH1);
      } else if (Number(maxAttractions) === 3 && Number(maxGems) === 0) {
        setItinerary(PATH2);
      } else if (Number(maxAttractions) === 0 && Number(maxGems) === 2) {
        setItinerary(PATH3);
      } else {
        //error
      }
      setFormSubmitted(true);
    }
  };

  const reset = () => {
    setFormSubmitted(false);
    setTotalTime("");
    setMaxAttractions("");
    setMaxGems("");
    // setSelectedAttraction(attraction);
    // setModalVisible(true);
  };

  return (
    <>
      {!formSubmitted && (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create Itinerary</Text>

            {formErrors.length > 0 && (
              <View style={styles.errorContainer}>
                {formErrors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>
                    {error}
                  </Text>
                ))}
              </View>
            )}

            {!formSubmitted && (
              <>
                <View style={styles.stepsContainer}>
                  <View>
                    <Image
                      source={require("../../assets/images/itinerary.jpg")}
                      style={styles.stepImage2}
                    />
                    <Text style={styles.label2}>
                      Enter your available time, attractions, and gems to get a customized
                      itinerary!{" "}
                    </Text>
                  </View>
                  <View style={styles.form}>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Time:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Avaiable Time (minutes)"
                        value={totalTime}
                        onChangeText={setTotalTime}
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                      />
                    </View>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Attractions:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Number of Attractions to see"
                        value={maxAttractions}
                        onChangeText={setMaxAttractions}
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                      />
                    </View>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Gems:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Number of Gems to see"
                        value={maxGems}
                        onChangeText={setMaxGems}
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}

      {formSubmitted && (
        <SafeAreaView style={styles.container2}>
          <Text style={styles.title}>New Itinerary</Text>

          {/* summary */}
          <View style={styles.stepsContainer}>
            {itinerary?.map((attraction, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepImage}>
                  <Image
                    source={imageMapping[attraction.icon as keyof typeof imageMapping]}
                    style={styles.stepImageinside}
                  />
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Stop {index + 1}</Text>
                  <Text style={styles.attractionName}>{attraction.name}</Text>
                  <Text style={styles.attractionType}>
                    {attraction.isGem === 1 ? "Hidden Gem" : "Attraction"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(tabs)",
                  params: { itinerary: JSON.stringify(itinerary) },
                });
                reset();
              }}
            >
              <Text style={styles.buttonText2}>Start Itinerary</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  label2: {
    height: 40,
    color: "gray",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  stepsContainer: {
    flex: 1,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepImage2: {
    width: 250,
    height: 150,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 10,
  },
  stepImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 4,
    margin: 20,
    resizeMode: "contain",
    overflow: "hidden",
  },
  stepImageinside: {
    width: "100%",
    height: "100%",
  },
  stepTextContainer: {
    width: "50%",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#black",
  },
  stepDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },

  itineraryList: {
    width: "90%",
    marginTop: 20,
    marginBottom: 20,
  },
  itineraryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  attractionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  attractionInfo: {
    flex: 1,
  },
  attractionName: {
    fontSize: 16,
    color: "#000",
  },
  attractionType: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer2: {
    position: "absolute",
    bottom: 100,
    left: 70,
    right: 70,
    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText2: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 35,
    color: "#333",
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  form: {
    marginHorizontal: 30,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputPlaceholder: {
    color: "#666",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
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
    elevation: 4,
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
    top: 40,
    left: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
