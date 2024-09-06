// React Native Core Components & APIs
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";

// Firebase Authentication Methods
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
  // Initialize Firebase authentication handler
  const auth = getAuth();

  // Pass function to onPress of start button
  const signInUser = () => {
    // Passes auth user info
    signInAnonymously(auth)
      // result is a returned information object, includes temporary user account info
      .then((result) => {
        navigation.navigate("ShoppingLists", { userID: result.user.uid });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, please try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Shopping Lists</Text>
      <TouchableOpacity style={styles.startButton} onPress={signInUser}>
        <Text style={styles.startButtonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 100,
  },
  startButton: {
    backgroundColor: "#000",
    height: 50,
    width: "88%",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
  },
});

export default Welcome;
