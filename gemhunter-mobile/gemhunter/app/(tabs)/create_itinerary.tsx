import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert  } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Attraction } from "@/constants/Attraction";
import { getAttractions } from "@/dao/attractionsDao";

export default function MainPage() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null); // Modifica tipo in base alla struttura che desideri
  const [totalTime, setTotalTime] = useState<string>(""); // Tempo disponibile
  const [maxAttractions, setMaxAttractions] = useState<string>(""); // Numero massimo di attrazioni
  const [maxGems, setMaxGems] = useState<string>(""); // Numero massimo di gemme
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false); // Flag per il form
  const [formErrors, setFormErrors] = useState<string[]>([]); // Per raccogliere gli errori di validazione
  const navigation = useNavigation();

  useEffect(() => {
    const loadAttractions = async () => {
      const results = await getAttractions();
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

  return (
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
  );
}

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
});


