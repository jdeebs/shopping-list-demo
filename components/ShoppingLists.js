import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";

const ShoppingLists = ({ db }) => {
  const [lists, setLists] = useState([]);

  const fetchShoppingLists = async () => {
    /**
     * The listsDocuments variable is a snapshot of the
       shoppinglists collection in the Firestore database
     * First argument of the collection function is the 
       database reference, second argument is the collection 
       name
    **/
    const listsDocuments = await getDocs(collection(db, "shoppinglists"));
    // To store the shopping lists
    let newLists = [];
    /**
     * Adds an object to newLists for each document in the collection
     * The ... spread operator adds the remaining property-value pairs to the return object. Without it, the remaining properties would be returned in a nested object which is invalid JavaScript object syntax
     **/
    listsDocuments.forEach((docObject) => {
      newLists.push({ id: docObject.id, ...docObject.data() });
    });
    // Update the state variable with the new list of shopping lists
    setLists(newLists);
  };

  useEffect(() => {
    // Call async function when component mounts
    fetchShoppingLists();
  }, [`${lists}`]);

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <Text>
            {item.name} : {item.items.join(", ")}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ShoppingLists;
