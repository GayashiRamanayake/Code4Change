// screens/InventoryScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";
import DatePickerModal from "../components/DatePickerModal";
import AddCategoryModal from "../components/AddCategoryModal";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

const API_URL = "https://neko-and-kopi-default-rtdb.firebaseio.com";

export default function InventoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const filterFromDashboard = route.params?.filter || null;

  const [inventoryList, setInventoryList] = useState([]);
  const [categories, setCategories] = useState(["All", "Coffee", "Sweeteners", "Other"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${API_URL}/inventory.json`);
      const data = res.data
        ? Object.keys(res.data).map((key) => ({ id: key, ...res.data[key] }))
        : [];
      setInventoryList(data);
    } catch (err) {
      console.log("Error fetching inventory:", err.message);
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filterFromDashboard) setSelectedCategory("All");
  }, [filterFromDashboard]);

  const handleSaveItem = async (item) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    if (item.id) {
      // Existing item — fetch current data first
      const res = await axios.get(`${API_URL}/inventory/${item.id}.json`);
      const currentItem = res.data;

      const updatedItem = {
        ...currentItem,
        ...item,
        updatedAt: today,
        history: currentItem.history ? [...currentItem.history, { date: today, stock: item.stock }] : [{ date: today, stock: item.stock }]
      };

      await axios.put(`${API_URL}/inventory/${item.id}.json`, updatedItem);
    } else {
      // New item — add initial history
      const newItem = {
        ...item,
        updatedAt: today,
        history: [{ date: today, stock: item.stock }]
      };
      await axios.post(`${API_URL}/inventory.json`, newItem);
    }

    fetchInventory();
    setAddModalVisible(false);
    setEditModalVisible(false);
    setItemToEdit(null);
  } catch (err) {
    console.log("Error saving item:", err.message);
  }
};


  const handleDeleteItem = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/inventory/${id}.json`);
            fetchInventory();
            setEditModalVisible(false);
          } catch (err) {
            console.log("Error deleting item:", err.message);
          }
        },
      },
    ]);
  };

  const handleAddCategory = (categoryName) => {
    setCategories([...categories, categoryName]);
  };

  const filteredData = inventoryList.filter((item) => {
    if (filterFromDashboard === "lowStock" && item.stock > 0 && item.stock <= (item.threshold || 5)) return true;
    if (filterFromDashboard === "outOfStock" && item.stock === 0) return true;
    if (filterFromDashboard === "expiring" && item.expiryDate && item.expiryDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) return true;
    if (!filterFromDashboard) return selectedCategory === "All" || item.category === selectedCategory;
    return false;
  });

  const totalItems = inventoryList.length;
  const lowStockCount = inventoryList.filter(item => item.stock > 0 && item.stock <= (item.threshold || 5)).length;
  const outOfStockCount = inventoryList.filter(item => item.stock === 0).length;

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
              { backgroundColor: item.stock <= item.threshold ? "#D32F2F" : "#4CAF50" },
            ]}
          />
          <Text style={styles.statusText}>{item.stock <= item.threshold ? "LOW" : "GOOD"}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setItemToEdit(item);
          setEditModalVisible(true);
        }}
      >
        <MaterialCommunityIcons name="note-edit-outline" size={22} color="#64B5F6" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <Text style={styles.headerSubtitle}>Stay updated on stock availability</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalItems}</Text>
          <Text style={styles.summaryLabel}>Total Items</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: "#F9A825" }]}>{lowStockCount}</Text>
          <Text style={styles.summaryLabel}>Low Stock</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: "#D32F2F" }]}>{outOfStockCount}</Text>
          <Text style={styles.summaryLabel}>Out of Stock</Text>
        </View>
      </View>

      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setDateModalVisible(true)}
        >
          <Ionicons name="time-outline" size={14} color="#fff" />
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}> Add</Text>
        </TouchableOpacity>
      </View>

      {!filterFromDashboard && (
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.categorySelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addCategoryButton} onPress={() => setAddCategoryModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={22} color="#64B5F6" />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modals */}
      <AddItemModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveItem}
        categories={categories.filter((c) => c !== "All")}
      />
      <EditItemModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        item={itemToEdit}
        categories={categories.filter((c) => c !== "All")}
      />
      <DatePickerModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onViewHistory={(selectedDate) => {
          setDateModalVisible(false);
          const formattedDate = selectedDate.toISOString().split("T")[0];
          navigation.navigate("History", { filterDate: formattedDate });
        }}
      />
      <AddCategoryModal
        visible={addCategoryModalVisible}
        onClose={() => setAddCategoryModalVisible(false)}
        onSave={handleAddCategory}
        existingCategories={categories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D0E6FA", padding: 16 },
  header: { marginBottom: 10,  marginTop: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#0D1B2A" },
  headerSubtitle: { fontSize: 14, color: "#0D1B2A", marginTop: 4 },
  summaryContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, marginHorizontal: 6, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#B0C4DE" },
  summaryNumber: { fontSize: 20, fontWeight: "bold", color: "#0D1B2A" },
  summaryLabel: { fontSize: 13, color: "#555", marginTop: 4 },
  headerButtons: { flexDirection: "row", justifyContent: "center", marginVertical: 20, gap: 12 },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E88E5", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  historyButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1976D2", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  historyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 6 },
  categoryRow: { flexDirection: "row", marginBottom: 16, alignItems: "center", flexWrap: "wrap" },
  categoryButton: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: "#A9CCE3", borderRadius: 20, marginRight: 8, marginBottom: 8 },
  categorySelected: { backgroundColor: "#1E88E5" },
  categoryText: { color: "#0D1B2A" },
  categoryTextSelected: { color: "#fff", fontWeight: "bold" },
  addCategoryButton: { padding: 6 },
  itemCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 14, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderWidth: 1, borderColor: "#B0C4DE" },
  itemName: { fontWeight: "bold", fontSize: 16, color: "#0D1B2A" },
  itemCategory: { fontSize: 13, color: "#0D1B2A" },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  itemQuantity: { fontSize: 15, marginRight: 6, color: "#0D1B2A" },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  statusText: { fontSize: 13, color: "#0D1B2A" },
});
