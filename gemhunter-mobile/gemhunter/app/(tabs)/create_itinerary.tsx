import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Attraction } from "@/constants/Attraction";
import { getAttractions } from "@/dao/attractionsDao";
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
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [totalTime, setTotalTime] = useState<string>("");
  const [maxAttractions, setMaxAttractions] = useState<string>("");
  const [maxGems, setMaxGems] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const timeInputRef = useRef<TextInput>(null);
  const attrInputRef = useRef<TextInput>(null);
  const gemInputRef = useRef<TextInput>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [itinerary, setItinerary] = useState<Attraction[]>();
  const [count, setCount] = useState(0);
  const router = useRouter();
  //da scegliere in base alla posizione delle attrazioni
  const PATH1 = attractions;
  const PATH2 = attractions.slice(0, 3);
  const PATH3 = attractions.slice(3, 5);
  //
  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
  };

  const [errors, setErrors] = useState({
    time: "",
    attractions: "",
    gems: "",
    general: "",
  });

  const scrollToInput = (ref: React.RefObject<TextInput>) => {
    if (!ref.current) return;
    const offset = Platform.OS === "ios" ? 20 : 10;
    ref.current.measureInWindow((x, y, width, height) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: y - offset,
          animated: true,
        });
      }
    });
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

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
    let valid = true; // Variabile normale, non uno stato
    const newErrors = { time: "", attractions: "", gems: "", general: "" };
    if (
      !totalTime ||
      isNaN(Number(totalTime)) ||
      Number(totalTime) <= 0 ||
      Number(totalTime) > 480
    ) {
      console.log("totalTime", totalTime);
      newErrors.time = "Please enter a valid total time (1-480 minutes).";
      valid = false;
    }
    if (
      !maxAttractions ||
      isNaN(Number(maxAttractions)) ||
      Number(maxAttractions) < 0 ||
      Number(maxAttractions) > 10
    ) {
      console.log("maxAttractions", maxAttractions);
      newErrors.attractions = "Please enter a valid number of attractions (0-10).";
      valid = false;
    }
    if (!maxGems || isNaN(Number(maxGems)) || Number(maxGems) < 0 || Number(maxGems) > 10) {
      console.log("maxGems", maxGems);
      newErrors.gems = "Please enter a valid number of gems (0-10).";
      valid = false;
    }
    if (valid) {
      if (Number(maxAttractions) === 3 && Number(maxGems) === 2) {
        setItinerary(PATH1);
      } else if (Number(maxAttractions) === 3 && Number(maxGems) === 0) {
        setItinerary(PATH2);
      } else if (Number(maxAttractions) === 0 && Number(maxGems) === 2) {
        setItinerary(PATH3);
      } else {
        valid = false;
        Alert.alert("No itinerary found for the selected options.");
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setFormSubmitted(true);
    }
  };

  const handleBackButton = () => {
    setFormSubmitted(false);
    setTotalTime("");
    setMaxAttractions("");
    setMaxGems("");
  };

  const reset = () => {
    setFormSubmitted(false);
    setTotalTime("");
    setMaxAttractions("");
    setMaxGems("");
  };

  return (
    <>
      {!formSubmitted && (
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.title}>Create Itinerary</Text>

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
                            ref={timeInputRef}
                            style={styles.input}
                            placeholder="Available Time (minutes)"
                            value={totalTime}
                            onChangeText={setTotalTime}
                            onFocus={() => scrollToInput(timeInputRef)}
                            keyboardType="numeric"
                            placeholderTextColor="#666"
                          />
                          {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
                        </View>
                        <View style={styles.fieldContainer}>
                          <Text style={styles.label}>Attractions:</Text>
                          <TextInput
                            ref={attrInputRef}
                            style={styles.input}
                            placeholder="Number of Attractions to see"
                            value={maxAttractions}
                            onChangeText={setMaxAttractions}
                            onFocus={() => scrollToInput(attrInputRef)}
                            keyboardType="numeric"
                            placeholderTextColor="#666"
                          />
                          {errors.attractions ? (
                            <Text style={styles.errorText}>{errors.attractions}</Text>
                          ) : null}
                        </View>
                        <View style={styles.fieldContainer}>
                          <Text style={styles.label}>Gems:</Text>
                          <TextInput
                            ref={gemInputRef}
                            style={styles.input}
                            placeholder="Number of Gems to see"
                            value={maxGems}
                            onChangeText={setMaxGems}
                            onFocus={() => scrollToInput(gemInputRef)}
                            keyboardType="numeric"
                            placeholderTextColor="#666"
                          />
                          {errors.gems ? <Text style={styles.errorText}>{errors.gems}</Text> : null}
                        </View>
                      </View>
                    </View>
                    {/* Messaggio di errore */}
                    {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
                    <View
                      style={[
                        styles.submitButtonContainer,
                        keyboardVisible
                          ? styles.submitButtonKeyboardOpen
                          : styles.submitButtonKeyboardClosed,
                      ]}
                    >
                      <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Create</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      )}
      {formSubmitted && (
        <SafeAreaView style={styles.container2}>
          <Text style={styles.title2}>New Itinerary</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => handleBackButton()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.scrollableAttractionContainer}>
            <ScrollView showsVerticalScrollIndicator={true}>
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
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log("itineraryyyyyyyy", itinerary);
                setCount(count + 1);
                router.push({
                  pathname: "/(tabs)",
                  params: { itinerary: JSON.stringify(itinerary), count: JSON.stringify(count) },
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
  backButton: {
    position: "absolute",
    top: 80,
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
  stepsContainer: {
    flex: 1,
  },
  scrollableAttractionContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Colore di sfondo leggermente diverso
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 140, // Spazio per il bottone
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "white",
  },
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
  attractionName: {
    fontSize: 16,
    color: "#000",
  },
  attractionType: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer: {
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
    backgroundColor: "white",
  },
  title: {
    marginTop: 80,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 35,
    color: "#333",
  },
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 35,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  submitButtonContainer: {
    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 70,
  },
  submitButtonKeyboardClosed: {
    marginTop: "auto",
    marginVertical: 100,
  },
  submitButtonKeyboardOpen: {
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
