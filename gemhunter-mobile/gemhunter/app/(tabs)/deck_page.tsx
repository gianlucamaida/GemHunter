import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Attraction } from "@/constants/Attraction"; // Assicurati che Attraction sia definito correttamente
import { getAttractions } from "@/dao/attractionsDao";

const DeckPage = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null); // Attrazione selezionata
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<any>();

  const imageMapping = {
    "mole_icon.jpg": require("../../assets/images/mole_icon.jpg"),
    "madama_icon.jpg": require("../../assets/images/madama_icon.jpg"),
    "granmadre_icon.jpg": require("../../assets/images/granmadre_icon.jpg"),
    "innamorati_icon.jpg": require("../../assets/images/innamorati_icon.jpg"),
    "testa_icon.jpg": require("../../assets/images/testa_icon.jpg"),
  };

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        const results = await getAttractions();
        // console.log(results);
        setAttractions(results); // Imposta le attrazioni nello state
      } catch (error) {
        console.error("Failed to load attractions:", error);
      }
    };

    loadAttractions();
  }, []);

  const handleCardClick = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAttraction(null);
    setShowModal(false);
  };

  const displayedAttractions = attractions
    .filter((attraction) => attraction.isFound === 1)
    .slice(0, 5);
  console.log("ATTRAZIONI DECK", displayedAttractions);

  return (
    <View style={styles.deckPage}>
      <Text style={styles.title}>Hunter's Deck</Text>

      <View style={styles.deckGrid}>
        {displayedAttractions.map((attraction) => (
          <View key={attraction.id} style={styles.deckItem}>
            <TouchableOpacity style={styles.deckSlot} onPress={() => handleCardClick(attraction)}>
              <Image
                source={imageMapping[attraction.icon as keyof typeof imageMapping]}
                style={styles.cardImage}
              />
            </TouchableOpacity>
            <Text style={styles.cardName}>{attraction.name}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Map")}>
        <Text style={styles.backButtonText}> Back to the map</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* {Attrazione} */}
          {selectedAttraction?.isGem === 0 && (
            <View style={styles.modalContent}>
              <>
                <Image
                  source={imageMapping[selectedAttraction.icon as keyof typeof imageMapping]}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedAttraction.name}</Text>
                <Text style={styles.modalDescription}>{selectedAttraction.description}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            </View>
          )}

          {/* {Gem} */}

          {selectedAttraction?.isGem === 1 && (
            <View style={styles.modalContentGemFound}>
              <ImageBackground
                source={require("../../assets/images/gem_background4.png")}
                style={styles.modalBackgroundImage}
                imageStyle={{ borderRadius: 20 }} // Per arrotondare i bordi dell'immagine
              >
                <Image
                  source={imageMapping[selectedAttraction.icon as keyof typeof imageMapping]}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedAttraction.name}</Text>
                <Text style={styles.modalDescription}>{selectedAttraction.description}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  deckPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: { position: "absolute", top: 100, fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  deckGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  deckItem: {
    alignItems: "center",
    margin: 10,
  },
  deckSlot: {
    width: 110,
    height: 110,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 100,
    overflow: "hidden",
  },
  slotNumber: { alignItems: "center", justifyContent: "center" },
  slotNumberText: { fontSize: 20, fontWeight: "bold" },
  slotCard: { alignItems: "center" },
  cardImage: {
    width: 130,
    height: 130,
  },
  cardName: { fontSize: 14, fontWeight: "bold" },
  backButton: {
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
  backButtonText: {
    color: "white", // Cambia il colore del testo a bianco
    fontSize: 16, // Puoi anche regolare la dimensione del testo
    fontWeight: "bold", // Testo in grassetto (opzionale)
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  modalImage: { width: "100%", height: 150, borderRadius: 15, marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalDescription: { fontSize: 16, textAlign: "center", marginBottom: 20, paddingInline: 30 },
  modalMessage: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  closeButton: {
    width: "80%",
    backgroundColor: "black",
    borderRadius: 30,
    elevation: 4, // Per ombre su Android
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontSize: 16 },
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
});

export default DeckPage;
