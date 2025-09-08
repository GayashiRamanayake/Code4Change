import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AddItemModal from "../components/AddItemModal";
import DatePickerModal from "../components/DatePickerModal";
import axios from "axios";

const API_URL = "https://neko-and-kopi-default-rtdb.firebaseio.com";

export default function InventoryScreen({ navigation }) {
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const categories = ["All", "Coffee", "Dairy", "Sweeteners", "Other"];

  // Fetch inventory from Firebase
  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_URL}/inventory.json`);
      const data = res.data ? Object.values(res.data) : [];
      setInventoryList(data);
    } catch (err) {
      console.log("Error fetching inventory:", err.message);
    }
  };

  useEffect(() => {
    fetchInventory();
    // Optional: poll every 5 seconds for real-time effect
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add new inventory item to Firebase
  const handleAddItem = async (item) => {
    try {
      console.log("Sending item to Firebase:", item);
      await axios.post(`${API_URL}/inventory.json`, item);
      fetchInventory(); // Refresh list
    } catch (err) {
      console.log("Error adding item:", err.message);
    }
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
          <Text style={styles.itemQuantity}>{item.stock}</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.stock <= item.threshold ? "red" : "green" },
            ]}
          />
          <Text style={styles.statusText}>
            {item.stock <= item.threshold ? "LOW" : "GOOD"}
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="note-edit-outline" size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated on stock availability
        </Text>
      </View>

      {/* Add and History Buttons */}
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.historyButton} onPress={() => setDateModalVisible(true)}>
          <Ionicons name="time-outline" size={14} color="#fff" />
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}> Add</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, selectedCategory === cat && styles.categorySelected]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextSelected]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modals */}
      <AddItemModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={handleAddItem} />
      <DatePickerModal visible={dateModalVisible} onClose={() => setDateModalVisible(false)} onViewHistory={(date) => console.log("History for date:", date)} />
    </View>
  );
}

// Styles (keep your existing styles)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "column", alignItems: "flex-start", width: "100%", marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 4 },
  headerButtons: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "flex-start", marginTop: 20, marginLeft: 170 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#333", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 5 },
  historyButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#4CAF50", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10 },
  historyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 6 },
  categoryRow: { flexDirection: "row", marginBottom: 16 },
  categoryButton: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: "#f1f1f1", borderRadius: 20, marginRight: 8 },
  categorySelected: { backgroundColor: "#80DEEA" },
  categoryText: { color: "#555" },
  categoryTextSelected: { color: "#fff", fontWeight: "bold" },
  itemCard: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderWidth: 1, borderColor: "#eee" },
  itemName: { fontWeight: "bold", fontSize: 16 },
  itemCategory: { color: "#888", fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  itemQuantity: { fontSize: 15, marginRight: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  statusText: { fontSize: 13, color: "green" },
});


