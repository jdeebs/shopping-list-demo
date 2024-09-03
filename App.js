import { StyleSheet } from "react-native";
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
    // NavigationContainer wraps the entire navigation system
    <NavigationContainer>
      {/* Define stack-based navigation structure, set "ShoppingLists" as the first screen */}
      <Stack.Navigator initialRouteName="ShoppingLists">
        {/* Define an individual screen in the stack */}
        <Stack.Screen name="ShoppingLists">
          {/* Functional component renders the ShoppingLists component, passing the Firestore database reference as a prop */}
          {(props) => <ShoppingLists db={db} {...props} />}
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
