import React, { useState, useEffect } from "react";
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
import { useIsFocused } from "@react-navigation/native";
import { getAttractions } from "@/dao/attractionsDao";
import { Attraction } from "@/constants/Attraction";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "Mario",
    lastName: "Rossi",
    email: "mario.rossi@studenti.polito.it",
    phone: "+39 3707005555",
    github: "https://github.com/polito-hci-2024/gemhunter",
    username: "@m_rossi",
    profileImage: require("../../assets/images/mario.jpg"), // Percorso relativo al file
  });

  const getGithubUsername = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1]; // Restituisce l'ultima parte dell'URL
  };

  const isFocus = useIsFocused();
  const [foundAttractionsCount, setFoundAttractionsCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadAttractions = async () => {
      try {
        if (isFocus) {
          const results = await getAttractions();
          setTotal(results.length);

          // Calculate found attractions count
          const foundCount = results.filter(
            (attraction: Attraction) => attraction.isFound === 1
          ).length;
          setFoundAttractionsCount(foundCount);
        }
      } catch (error) {
        console.error("Failed to load attractions:", error);
      }
    };
    loadAttractions();
  }, [isFocus]);

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
        <Text style={styles.contactTitle}>Album</Text>
        <View style={styles.contactGroup}>
          <Ionicons name="book-outline" size={24} color="green" />
          <Text style={styles.contactText}>
            Turin's deck: {foundAttractionsCount}/{total}
          </Text>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginVertical: 30,
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
