import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
//import API from '../API.mjs';

const AddGem = () => {
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const cameraRef = useRef(null);

  // Funzione per ottenere la posizione dell'utente
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

  // Funzione per chiedere il permesso della fotocamera e scattare la foto
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
      const photoUri = result.assets[0].uri; // Accedi al 'uri' correttamente
      setPhoto(photoUri);
      setShowModal(true);
    }
  };

  // Funzione per inviare i dati
  const handleSubmit = async () => {
    if (!name || !comment || !photo || lat === null || lon === null) {
      alert("Please fill in all fields, including location.");
      return;
    }
    setIsSubmitting(true);
    try {
      //const response = await API.addGem(name, photo, lat, lon, comment);  // Invia i dati al server
      setIsSubmitted(true);
      setSubmitMessage("Gem added successfully!");
    } catch (error) {
      console.error("Error submitting gem:", error);
      setIsSubmitted(true);
      setSubmitMessage("Error submitting gem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title}>Add a New Gem</Text>
        <Image
          source={require("../../assets/icons/gemma_icon.webp")} // Inserisci l'immagine
          style={styles.image} // Stile per l'immagine
        />
      </View>

      {/* Fotocamera */}
      <View style={styles.cameraContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Modal per la foto scattata */}
      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContent}>
          {photo && <Image source={{ uri: photo }} style={styles.capturedImage} />}
          <TextInput
            style={styles.input}
            placeholder="Enter the name of the gem"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Enter a comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <Button
            title={isSubmitting ? "Submitting..." : "Submit"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>
      </Modal>

      {/* Modal per il risultato dell'invio */}
      <Modal
        visible={isSubmitted}
        animationType="slide"
        onRequestClose={() => setIsSubmitted(false)}
      >
        <View style={styles.modalContent}>
          <Text>{submitMessage}</Text>
          <Button title="Close" onPress={() => setIsSubmitted(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cameraContainer: {
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: "black",
    padding: 15,
    paddingLeft: 70,
    paddingRight: 70,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
  },
  image: {
    width: 50, // Cambia la larghezza come desideri
    height: 50, // Cambia l'altezza come desideri
    resizeMode: "contain", // Opzionale, per mantenere le proporzioni corrette
    //transform: [{ rotate: '15deg' }], // Aggiungi la rotazione desiderata
    marginBottom: 20,
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: "row", // Dispone gli elementi in orizzontale
    alignItems: "center", // Centra verticalmente gli elementi
    marginBottom: 5,
  },
});

export default AddGem;
