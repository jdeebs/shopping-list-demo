// React Core Hooks
import { useState, useEffect } from "react";

// React Native Core Components & APIs
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

// Firebase Firestore Methods
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

// Async Storage for Data Caching
import AsyncStorage from "@react-native-async-storage/async-storage";

const ShoppingLists = ({ db, route, isConnected }) => {
  // Initialize state to hold the lists and form inputs
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");

  // Extract userID prop via route params
  const { userID } = route.params;

  // Called when the Add button is pressed
  const addShoppingList = async (newList) => {
    // Check if all fields are filled before adding list
    if (listName === "" || item1 === "" || item2 === "") {
      Alert.alert("Please fill out all fields before adding the list.");
      return; // Exit function early if validation fails
    }

    const newListRef = await addDoc(collection(db, "shoppinglists"), newList);
    // If the write query was successful it will have an id property and we can display a success message
    if (newListRef.id) {
      setLists([newList, ...lists]);
      Alert.alert(`The list "${listName}" has been added.`);
    } else {
      Alert.alert("There was a problem adding the list. Please try again.");
    }
  };

  let unsubShoppinglists;
  useEffect(() => {
    // Only run if connected to the internet
    if (isConnected === true) {
      // Unregister current onSnapshot listener to avoid registering multiple listeners when useEffect code is re-executed, causing memory leak.
      if (unsubShoppinglists) unsubShoppinglists();
      unsubShoppinglists = null;
      // Define query to fetch documents from shoppinglists collection
      const q = query(
        collection(db, "shoppinglists"),
        // Only return shopping lists that belong to the specific user
        where("uid", "==", userID)
      );
      unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
        let newLists = [];
        // Iterate over the returned documents and create a new object combining ID and data
        documentsSnapshot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        // Cache lists when updated
        cacheShoppingLists(newLists);
        // Update list state with new document object
        setLists(newLists);
      });
    } else loadCachedLists();

    // Unregister listener to prevent duplicated listeners (memory leaks) when component re-renders
    return () => {
      if (unsubShoppinglists) unsubShoppinglists();
    };
  }, [isConnected]);

  // Function to cache the shopping lists in AsyncStorage for offline usage
  const cacheShoppingLists = async (listsToCache) => {
    try {
      // Create cached list
      await AsyncStorage.setItem(
        "shopping_lists",
        // Convert list data to a string for storage
        JSON.stringify(listsToCache)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to load cached shopping lists from AsyncStorage when app is offline
  const loadCachedLists = async () => {
    // Retrieve the cached lists
    const cachedLists = (await AsyncStorage.getItem("shopping_lists")) || [];
    // Parse the cached data back into an array and update the list state
    setLists(JSON.parse(cachedLists));
  };

  // Handle list deletion with a confirmation prompt
  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the list "${item.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDelete(item),
          style: "destructive",
        },
      ]
    );
  };

  // Delete the list from the database and the UI
  const handleDelete = async (item) => {
    try {
      await deleteDoc(doc(db, "shoppinglists", item.id));
      setLists(lists.filter((list) => list.id !== item.id));
    } catch (error) {
      Alert.alert(
        "There was a problem deleting the list. Please try again after refreshing the app."
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listsContainer}
        data={lists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>
              {/* Check that the items array exists before using join to avoid undefined errors */}
              {item.name} : {item.items ? item.items.join(", ") : ""}
            </Text>
            {/* Only render the delete form when connected to the internet */}
            {isConnected === true ? (
            <TouchableOpacity
              style={styles.deleteButton}
              // On button press, delete the list from the database and UI
              onPress={() => {
                confirmDelete(item);
              }}
            >
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
            ) : null}
          </View>
        )}
      />
      {/* Only render the add form when connected to the internet */}
      {isConnected === true ? (
        <View style={styles.listForm}>
          <TextInput
            style={styles.listName}
            placeholder="List name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #1"
            value={item1}
            onChangeText={setItem1}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #2"
            value={item2}
            onChangeText={setItem2}
          />
          <TouchableOpacity
            style={styles.addButton}
            // On button press, create a new object out of the three states values, then call the addShoppingList function
            onPress={() => {
              const newList = {
                // Ensure new lists contain unique userID for filtering of lists per user
                uid: userID,
                name: listName,
                items: [item1, item2],
              };
              addShoppingList(newList);
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    flexGrow: 1,
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC",
  },
  listName: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  item: {
    height: 50,
    padding: 15,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  addButton: {
    height: 50,
    backgroundColor: "#000",
    color: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20,
  },
  deleteButton: {
    width: 80,
    height: 30,
    backgroundColor: "#000000",
    color: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FF0000",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default ShoppingLists;
