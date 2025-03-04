import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const AddGem = () => {
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const commentInputRef = useRef<TextInput>(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmission = () => {
    if (!name.trim() || !comment.trim()) {
      setErrorMessage("Both fields are required!");
      return;
    }
    setErrorMessage(null);
    setConfirmationVisible(true);
  };

  const resetModal = () => {
    setConfirmationVisible(false);
    setName("");
    setComment("");
    setPhoto(null);
    setLat(null);
    setLon(null);

    setTimeout(() => {
      setShowModal(false);
    }, 50);
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

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLat(location.coords.latitude);
    setLon(location.coords.longitude);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera was denied");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      setPhoto(photoUri);
      setShowModal(true);
    }
  };

  useEffect(() => {
    getLocation();
    Keyboard.dismiss();
  }, []);

  const scrollToInput = (ref: React.RefObject<TextInput>) => {
    setTimeout(() => {
      ref.current?.measure((fx, fy, width, height, px, py) => {
        scrollViewRef.current?.scrollTo({
          y: py - 100,
          animated: true,
        });
      });
    }, 50);
  };

  const [tooltipModalVisible, setTooltipModalVisible] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState("");

  const tooltips = {
    name: "Enter the specific name of the hidden gem. Be precise and descriptive.",
    description:
      "Provide a detailed explanation of why this location is special. What makes it a hidden gem? Include unique features, atmosphere, or personal experiences.",
  };

  const showTooltip = (type: keyof typeof tooltips) => {
    setCurrentTooltip(tooltips[type]);
    setTooltipModalVisible(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add a New Gem</Text>
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
      <TouchableOpacity onPress={takePhoto}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide" onRequestClose={resetModal}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  ref={scrollViewRef}
                  contentContainerStyle={styles.modalContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={resetModal}>
                      <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Add a New Gem</Text>
                    {photo && <Image source={{ uri: photo }} style={styles.capturedImage} />}

                    <View style={styles.fieldContainer}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Name:</Text>
                      </View>
                      <View style={styles.inputWithTooltipContainer}>
                        <TextInput
                          ref={nameInputRef}
                          style={styles.input}
                          placeholder="Enter the name of the gem"
                          placeholderTextColor="gray"
                          value={name}
                          onChangeText={setName}
                          onFocus={() => scrollToInput(nameInputRef)}
                        />
                        <TouchableOpacity
                          style={styles.inlineTooltip}
                          onPress={() => showTooltip("name")}
                        >
                          <Text style={styles.tooltipButtonInside}>?</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.fieldContainer}>
                      <View style={styles.labelContainer}>
                        <Text style={styles.label}>Description:</Text>
                      </View>
                      <View style={styles.inputWithTooltipContainer}>
                        <TextInput
                          ref={commentInputRef}
                          style={[styles.input, styles.textarea]}
                          placeholder="Enter a brief description"
                          placeholderTextColor="gray"
                          value={comment}
                          onChangeText={setComment}
                          multiline
                          onFocus={() => scrollToInput(commentInputRef)}
                        />
                        <TouchableOpacity
                          style={styles.inlineTooltip}
                          onPress={() => showTooltip("description")}
                        >
                          <Text style={styles.tooltipButtonInside}>?</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* Messaggio di errore */}
                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    <TouchableOpacity onPress={handleSubmission}>
                      <View
                        style={[
                          styles.submitButtonContainer,
                          keyboardVisible
                            ? styles.submitButtonKeyboardOpen
                            : styles.submitButtonKeyboardClosed,
                        ]}
                      >
                        <Text style={styles.buttonText}>Submit</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <Modal
                    visible={tooltipModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setTooltipModalVisible(false)}
                  >
                    <View style={styles.tooltipOverlay}>
                      <View style={styles.tooltipContainer}>
                        <Text style={styles.tooltipText}>{currentTooltip}</Text>
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setTooltipModalVisible(false)}
                        >
                          <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
        <Modal
          visible={confirmationVisible}
          transparent={true}
          animationType="fade"
          statusBarTranslucent
        >
          <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationBox}>
              <Text style={styles.confirmationText}>Submission successful! </Text>
              <Text style={styles.confirmationTextnotbold}>
                We'll review your gem soon. Check your email for updates.{" "}
              </Text>

              <TouchableOpacity
                style={styles.okButton}
                onPress={() => {
                  resetModal();
                }}
              >
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
    </SafeAreaView>
  );
};

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

  tooltipOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tooltipContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  tooltipText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  tooltipCloseButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  tooltipCloseText: {
    color: "white",
    fontWeight: "bold",
  },

  backButton: {
    zIndex: 1,

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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  confirmationOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 10,
  },
  confirmationBox: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    zIndex: 1000000,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  confirmationTextnotbold: {
    fontSize: 16,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButtonContainer: {
    bottom: 0,

    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
  },
  submitButtonKeyboardClosed: {
    marginTop: 150,
    marginBottom: 0,
  },
  submitButtonKeyboardOpen: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  modalContent: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  stepsContainer: {
    flex: 1,
    marginTop: 50,
    marginVertical: 30,
    marginHorizontal: 20,
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
  },
});

export default AddGem;
