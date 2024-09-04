import { useState, useEffect } from "react";
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
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const ShoppingLists = ({ db }) => {
  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");

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

  useEffect(() => {
    const ubsubShoppinglists = onSnapshot(
      collection(db, "shoppinglists"),
      (documentsSnapshot) => {
        let newLists = [];
        documentsSnapshot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        setLists(newLists);
      }
    );

    // Clean up code
    return () => {
      if (ubsubShoppinglists) ubsubShoppinglists();
    };
  }, []);

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
      Alert.alert("There was a problem deleting the list. Please try again after refreshing the app.");
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

            <TouchableOpacity
              style={styles.deleteButton}
              // On button press, delete the list from the database and UI
              onPress={() => {
                confirmDelete(item);
              }}
            >
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
              name: listName,
              items: [item1, item2],
            };
            addShoppingList(newList);
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
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
