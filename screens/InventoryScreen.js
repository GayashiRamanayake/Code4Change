import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AddItemModal from "../components/AddItemModal";

export default function InventoryScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Coffee", "Dairy", "Sweeteners"];

  const initialInventory = [
    {
      id: "1",
      name: "Coffee Beans",
      category: "Coffee",
      quantity: "2.5 kg",
      status: "GOOD",
      lastUpdated: "2025-01-27",
      lowStock: "1 kg",
    },
    {
      id: "2",
      name: "Milk",
      category: "Dairy",
      quantity: "3 L",
      status: "GOOD",
      lastUpdated: "2025-01-27",
      lowStock: "1000 ml",
    },
  ];

  const [inventoryList, setInventoryList] = useState(initialInventory);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddItem = (item) => {
    setInventoryList([...inventoryList, item]);
  };

  const filteredData =
    selectedCategory === "All"
      ? inventoryList
      : inventoryList.filter((item) => item.category === selectedCategory);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <View style={styles.row}>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.itemDate}>Last updated: {item.lastUpdated}</Text>
        <Text style={styles.lowStock}>Low stock: {item.lowStock}</Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="note-edit-outline"
          size={22}
          color="#555"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated on stock availabilty in Inventory
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Search ingredients..."
          style={styles.searchInput}
        />
      </View>

      {/* History and Add Buttons */}
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => alert("History button pressed!")}
        >
          <Ionicons name="time-outline" size={14} color="#fff" />
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}> Add</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categorySelected,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Add Item Modal */}
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 4 },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 5 },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  historyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 6 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  categoryRow: { flexDirection: "row", marginBottom: 16 },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 8,
  },
  categorySelected: { backgroundColor: "#80DEEA" },
  categoryText: { color: "#555" },
  categoryTextSelected: { color: "#fff", fontWeight: "bold" },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemName: { fontWeight: "bold", fontSize: 16 },
  itemCategory: { color: "#888", fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  itemQuantity: { fontSize: 15, marginRight: 6 },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: "green",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  statusText: { fontSize: 13, color: "green" },
  itemDate: { fontSize: 11, color: "#888" },
  lowStock: { fontSize: 11, color: "#999" },
});
