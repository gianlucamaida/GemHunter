import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ImageBackground,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Attraction } from "@/constants/Attraction";
import { getAttractions } from "@/dao/attractionsDao";

const ITEMS_PER_PAGE = 6;
const NUM_COLUMNS = 2;

const DeckPage = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [displayedAttractions, setDisplayedAttractions] = useState<Attraction[]>([]);

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
        setAttractions(results.concat(results).concat(results));
      } catch (error) {
        console.error("Failed to load attractions:", error);
      }
    };
    loadAttractions();
  }, []);

  const handleCardClick = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    attraction.isFound === 1 && setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAttraction(null);
    setShowModal(false);
  };

  const handleNextPage = () => {
    if (page < attractions.length / ITEMS_PER_PAGE) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (attractions.length > 0) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = page * ITEMS_PER_PAGE;
      setDisplayedAttractions(attractions.slice(start, end));
    }
  }, [attractions, page]);

  const renderItem = ({ item }: { item: Attraction }) => (
    <View style={styles.deckItem}>
      <TouchableOpacity style={styles.deckSlot} onPress={() => handleCardClick(item)}>
        <ImageBackground
          source={imageMapping[item.icon as keyof typeof imageMapping]}
          style={styles.cardImage}
          imageStyle={item.isFound === 0 ? styles.imageBlurred : {}}
        >
          {item.isFound === 0 && (
            <View style={styles.overlay}>
              <Text style={styles.questionMark}>???</Text>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
      <Text style={styles.cardName}>{item.isFound === 1 ? item.name : "???"}</Text>
    </View>
  );

  return (
    <View style={styles.deckPage}>
      <Text style={styles.title}>Hunter's Deck</Text>
      <FlatList
        data={displayedAttractions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.deckGrid}
      />
      {page > 1 && !(page * ITEMS_PER_PAGE < attractions.length) && (
        <TouchableOpacity style={styles.prevButtonFull} onPress={handlePrevPage}>
          <Text style={styles.backButtonText}>Prev</Text>
        </TouchableOpacity>
      )}

      {page * ITEMS_PER_PAGE < attractions.length && !(page > 1) && (
        <TouchableOpacity style={styles.nextButtonFull} onPress={handleNextPage}>
          <Text style={styles.backButtonText}>Next</Text>
        </TouchableOpacity>
      )}

      {page > 1 && page * ITEMS_PER_PAGE < attractions.length && (
        <>
          <TouchableOpacity style={styles.prevButton} onPress={handlePrevPage}>
            <Text style={styles.backButtonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPage}>
            <Text style={styles.backButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

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
  modalImage: { width: "100%", height: 150, borderRadius: 15, marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalDescription: { fontSize: 16, textAlign: "center", marginBottom: 20, paddingInline: 30 },
  deckPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 95,
    backgroundColor: "white",
  },
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  deckGrid: {
    alignItems: "center",
    justifyContent: "center",
  },
  deckItem: {
    alignItems: "center",
    margin: 15,
  },
  deckSlot: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardName: {
    maxWidth: 110,
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  prevButton: {
    width: 100,
    position: "absolute",
    bottom: 100,
    left: 80,
    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    width: 100,
    position: "absolute",
    bottom: 100,
    right: 80,
    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  prevButtonFull: {
    width: 250,
    position: "absolute",
    bottom: 100,

    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonFull: {
    width: 250,
    position: "absolute",
    bottom: 100,

    backgroundColor: "black",
    borderRadius: 30,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  imageBlurred: {
    opacity: 0.3,
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
});

export default DeckPage;
