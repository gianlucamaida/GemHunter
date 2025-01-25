import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "Gianluca",
    lastName: "Maida",
    email: "gianlucamaida@studenti.polito.it",
    phone: "+39 3707005546",
    github: "https://github.com/Gianluca280600",
    username: "@g_maida",
    profileImage: require("../../assets/profile_images/IMG_7471.jpg"), // Percorso relativo al file
  });

  const getGithubUsername = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1]; // Restituisce l'ultima parte dell'URL
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity>
          <Image source={userData.profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.changeUserText}>Tap to change user/modify</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First name:</Text>
          <TextInput style={styles.input} value={userData.firstName} editable={false} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last name:</Text>
          <TextInput style={styles.input} value={userData.lastName} editable={false} />
        </View>
        <Text style={styles.contactTitle}>Contacts</Text>
        <View style={styles.contactGroup}>
          <Ionicons name="mail-outline" size={24} color="green" />
          <Text style={styles.contactText}>{userData.email}</Text>
        </View>
        <View style={styles.contactGroup}>
          <Ionicons name="call-outline" size={24} color="green" />
          <Text style={styles.contactText}>{userData.phone}</Text>
        </View>
        <View style={styles.contactGroup}>
          <Ionicons name="logo-github" size={24} color="green" />
          <TouchableOpacity onPress={() => Linking.openURL(userData.github)}>
            <Text style={[styles.contactText, styles.githubText]}>
              {getGithubUsername(userData.github)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.3,
    borderWidth: 4,
    margin: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  changeUserText: {
    fontSize: 14,
    color: "green",
  },
  detailsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#aaa",
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 16,
  },
  contactGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 8,
  },
  githubText: {
    color: "black", // Colore per indicare che è cliccabile
    textDecorationLine: "underline", // Sottolinea il testo
  },
});

export default Profile;
