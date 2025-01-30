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
  const [itinerary, setItinerary] = useState<Attraction[]>([]);
  const router = useRouter();
  const PATH1 = attractions;
  const PATH2 = attractions.slice(0, 3);
  const PATH3 = attractions.slice(3, 5);

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
      }
      setFormSubmitted(true);
    }
  };

  const openModal = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setModalVisible(true);
  };

  return (
    <>
      {!formSubmitted && (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Text style={styles.title}>Create your itinerary!</Text>

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
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Avaiable Time (minutes)"
                  value={totalTime}
                  onChangeText={setTotalTime}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Number of Attractions to see"
                  value={maxAttractions}
                  onChangeText={setMaxAttractions}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Number of Gems to see"
                  value={maxGems}
                  onChangeText={setMaxGems}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />

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
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>New Itinerary</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <Image
                source={require("../../assets/addgem_images/step1_img.png")}
                style={styles.stepImage}
              />
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Step 1</Text>
                <Text style={styles.stepDescription}>
                  Take a clear photo of the gem you discovered. Ensure good lighting and focus.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <Image
                source={require("../../assets/addgem_images/step2_img.png")}
                style={styles.stepImage}
              />
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Step 2</Text>
                <Text style={styles.stepDescription}>
                  Fill out the form with the gem's name and a detailed description.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <Image
                source={require("../../assets/addgem_images/step3_img.png")}
                style={styles.stepImage}
              />
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Step 3</Text>
                <Text style={styles.stepDescription}>
                  Submit your entry and wait for our experts to review and verify your discovery.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(tabs)",
                  params: { itinerary: JSON.stringify(itinerary) },
                });
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
  stepsContainer: {
    flex: 1,
    marginVertical: 40,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 4,
    margin: 20,
    resizeMode: "contain",
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
    color: "#666",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    paddingLeft: 70,
    paddingRight: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
