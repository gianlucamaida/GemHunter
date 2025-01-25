import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from "react-native";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
  });

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = () => {
    setUserData({
      ...userData,
      name: formData.name,
      email: formData.email,
    });
    setEditing(false);
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.title}>Il Mio Profilo</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Image
            source={{
              uri: "https://via.placeholder.com/150/0000FF/FFFFFF?text=User",
            }}
            style={styles.avatarIcon}
          />
          <Text style={styles.userName}>{userData.name}</Text>
        </View>

        {!editing ? (
          <View style={styles.profileInfo}>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <TouchableOpacity onPress={handleEditToggle} style={styles.button}>
              <Text style={styles.buttonText}>Modifica Profilo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Salva" onPress={handleFormSubmit} />
              <Button title="Annulla" onPress={handleEditToggle} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileAvatar: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  profileForm: {
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Profile;
