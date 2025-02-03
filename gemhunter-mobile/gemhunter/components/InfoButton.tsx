import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { IconSymbol } from "./ui/IconSymbol";

const InfoButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.infoButton}>
        <Icon name="information-circle-outline" size={30} color="#ffffff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.mainTitle}>Info</Text>
            <Text style={styles.text}>
              Welcome to <Text style={styles.bold}>GemHunter</Text>! Your goal is to explore and
              collect all the gems and attractions in the city.
            </Text>
            <Text style={styles.text}>
              Right now you can see every gem and attraction you have already found.
            </Text>
            <Text style={styles.text}>
              Press the <Text style={styles.bold}>Start Hunt</Text> button and go explore the city
              to find new ones!
            </Text>

            <Text style={[styles.title, { marginTop: 15 }]}>Legend</Text>

            <View style={styles.legendItem}>
              <Image
                source={require("../assets/images/IMG_0535-nobg.png")}
                style={styles.legendIcon}
              />
              <Text style={styles.legendText}>Found Gem</Text>
            </View>

            <View style={styles.legendItem}>
              <Image
                source={require("../assets/images/IMG_0536-nobg.png")}
                style={styles.legendIcon}
              />
              <Text style={styles.legendText}>Main Attraction</Text>
            </View>

            <View style={styles.legendItem}>
              <IconSymbol name="circle.fill" size={35} color="green" />
              <Text style={styles.legendText2}>Not found Gem</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  infoButton: {
    backgroundColor: "black",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  legendIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  legendText2: {
    fontSize: 16,
    marginLeft: 12,
  },
  legendText: {
    fontSize: 16,
  },
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
});

export default InfoButton;
