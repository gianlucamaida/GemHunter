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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const resetModal = () => {
    setShowModal(false);
    setKeyboardVisible(false);
    Keyboard.dismiss();
    setName("");
    setComment("");
    setPhoto(null);
    setLat(null);
    setLon(null);

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 1000);
  };

  // Aggiungi questo useEffect per gestire gli eventi della tastiera
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

  // funzione per ottenere la posizione attuale dell'utente
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

  // funzione per scattare una foto
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

  // Funzione per scorrere fino all'input attuale
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

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
                    <TouchableOpacity style={styles.closeButton} onPress={resetModal}>
                      <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Add a New Gem</Text>
                    {photo && <Image source={{ uri: photo }} style={styles.capturedImage} />}

                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Name:</Text>
                      <TextInput
                        ref={nameInputRef}
                        style={styles.input}
                        placeholder="Enter the name of the gem"
                        placeholderTextColor="gray"
                        value={name}
                        onChangeText={setName}
                        onFocus={() => scrollToInput(nameInputRef)}
                      />
                    </View>

                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Description:</Text>
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
                    </View>
                    <View
                      style={[
                        styles.submitButtonContainer,
                        keyboardVisible
                          ? styles.submitButtonKeyboardOpen
                          : styles.submitButtonKeyboardClosed,
                      ]}
                    >
                      <TouchableOpacity onPress={() => console.log("Submit pressed!")}>
                        <Text style={styles.buttonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  submitButtonContainer: {
    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
  },
  submitButtonKeyboardClosed: {
    marginTop: "auto", // Questo spingerà il bottone verso il basso
    marginBottom: 30,
  },
  submitButtonKeyboardOpen: {
    marginVertical: 20, // Margine più piccolo quando la tastiera è aperta
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  modalContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
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
  closeButton: {
    position: "absolute",
    top: 70,
    left: 25,
    backgroundColor: "black",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
