import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import the screens
import ShoppingLists from "./components/ShoppingLists";

// Create the navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCMxqYwTFBSHzeEdvI5sVZNr7fnHtavNjM",
    authDomain: "shopping-list-demo-d2f2c.firebaseapp.com",
    projectId: "shopping-list-demo-d2f2c",
    storageBucket: "shopping-list-demo-d2f2c.appspot.com",
    messagingSenderId: "378631312389",
    appId: "1:378631312389:web:b86f3693542925a33c786c",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ShoppingLists">
        <Stack.Screen name="ShoppingLists" component={ShoppingLists} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
