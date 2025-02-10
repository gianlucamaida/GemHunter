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
  ImageBackground,
  Modal,
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
  const PATH1 = attractions.filter(
    (attraction) =>
      attraction.isGem !== 1 ||
      (attraction.isFound === 1 && attraction.name !== "Panchina degli innamorati")
  );
  const PATH2 = attractions.filter((attraction) => attraction.isGem === 0);
  const PATH3 = attractions.filter(
    (attraction) => attraction.isGem === 1 && attraction.isFound === 1
  );

  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
    "diavolo_icon.jpg": require("../../assets/images/diavolo_icon.jpg"),
    "piercing_icon.jpg": require("../../assets/images/piercing_icon.jpg"),
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
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState("");

  const tooltips = {
    time: "Enter the total time you have available for your itinerary in minutes. For example, if you have 3 hours, enter 180.",
    attractions:
      "Specify the maximum number of attractions you want to visit during your trip. This helps create a focused itinerary.",
    gems: "Enter the number of gems you'd like to include in your itinerary. These are less touristy locations that offer authentic experiences.",
  };

  const showTooltip = (type: keyof typeof tooltips) => {
    setCurrentTooltip(tooltips[type]);
    setModalVisible(true);
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
                          <View style={styles.labelContainer}>
                            <Text style={styles.label}>Time:</Text>
                          </View>
                          <View style={styles.inputWithTooltipContainer}>
                            <TextInput
                              ref={timeInputRef}
                              style={styles.input}
                              placeholder="Time Available (minutes)"
                              value={totalTime}
                              onChangeText={setTotalTime}
                              onFocus={() => scrollToInput(timeInputRef)}
                              keyboardType="numeric"
                              placeholderTextColor="#666"
                            />
                            <TouchableOpacity
                              style={styles.inlineTooltip}
                              onPress={() => showTooltip("time")}
                            >
                              <Text style={styles.tooltipButtonInside}>?</Text>
                            </TouchableOpacity>
                          </View>
                          {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
                        </View>

                        <View style={styles.fieldContainer}>
                          <View style={styles.labelContainer}>
                            <Text style={styles.label}>Attractions:</Text>
                          </View>
                          <View style={styles.inputWithTooltipContainer}>
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
                            <TouchableOpacity
                              style={styles.inlineTooltip}
                              onPress={() => showTooltip("attractions")}
                            >
                              <Text style={styles.tooltipButtonInside}>?</Text>
                            </TouchableOpacity>
                          </View>
                          {errors.attractions ? (
                            <Text style={styles.errorText}>{errors.attractions}</Text>
                          ) : null}
                        </View>

                        <View style={styles.fieldContainer}>
                          <View style={styles.labelContainer}>
                            <Text style={styles.label}>Gems:</Text>
                          </View>
                          <View style={styles.inputWithTooltipContainer}>
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
                            <TouchableOpacity
                              style={styles.inlineTooltip}
                              onPress={() => showTooltip("gems")}
                            >
                              <Text style={styles.tooltipButtonInside}>?</Text>
                            </TouchableOpacity>
                          </View>
                          {errors.gems ? <Text style={styles.errorText}>{errors.gems}</Text> : null}
                        </View>
                      </View>

                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                      >
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{currentTooltip}</Text>

                            <TouchableOpacity
                              onPress={() => setModalVisible(false)}
                              style={styles.closeButton}
                            >
                              <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                    {/* Messaggio di errore */}
                    {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

                    <TouchableOpacity onPress={handleSubmit}>
                      <View
                        style={[
                          styles.submitButtonContainer,
                          keyboardVisible
                            ? styles.submitButtonKeyboardOpen
                            : styles.submitButtonKeyboardClosed,
                        ]}
                      >
                        <Text style={styles.buttonText}>Create</Text>
                      </View>
                    </TouchableOpacity>
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
                    <ImageBackground
                      source={imageMapping[attraction.icon as keyof typeof imageMapping]}
                      style={styles.stepImageinside}
                      imageStyle={attraction.isFound === 0 ? styles.imageBlurred : {}}
                    >
                      {attraction.isFound === 0 && (
                        <View style={styles.overlay}>
                          <Text style={styles.questionMark}>???</Text>
                        </View>
                      )}
                    </ImageBackground>
                  </View>
                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>Stop {index + 1}</Text>
                    <Text style={styles.attractionName}>
                      {attraction.isFound === 1 ? attraction.name : "Find me!"}
                    </Text>

                    <Text style={styles.attractionType}>
                      {attraction.isGem === 1 ? "Hidden Gem" : "Attraction"}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

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
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText2}>Start Itinerary</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 15,
    width: "80%",
    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Ombra su Android
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputWithTooltipContainer: {
    position: "relative",
  },
  inlineTooltip: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipButtonInside: {
    color: "black",
    fontWeight: "bold",
  },

  tooltipCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  questionMark: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  imageBlurred: {
    opacity: 0.3,
  },
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
    height: 160,
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
    bottom: 66,
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
