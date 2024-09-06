// React Core Hooks
import { useEffect } from "react";

// React Native Core Components & APIs
import { StyleSheet, LogBox, Alert } from "react-native";

// Firebase Core & Firestore Modules
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

// React Navigation Modules
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Network Information Hook
import { useNetInfo } from "@react-native-community/netinfo";

// App Screens
import ShoppingLists from "./components/ShoppingLists";
import Welcome from "./components/Welcome";

// Create the navigator
const Stack = createNativeStackNavigator();

// Ignore warning log popup related to deprecated package
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

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

  // Define new state for network connectivity status
  const connectionStatus = useNetInfo();

  // Alert if connection is lost and disable Firestore db reconnect attempts until connection is re-established
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    // NavigationContainer wraps the entire navigation system
    <NavigationContainer>
      {/* Define stack-based navigation structure, set "Welcome.js" as the first screen */}
      <Stack.Navigator initialRouteName="Welcome">
        {/* Define the Welcome and ShoppingLists screens in the stack */}
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ShoppingLists">
          {/* Functional component renders the ShoppingLists component, passing the Firestore db reference and connectionStatus state as a prop */}
          {(props) => (
            <ShoppingLists
              isConnected={connectionStatus.isConnected}
              db={db}
              {...props}
            />
          )}
        </Stack.Screen>
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
