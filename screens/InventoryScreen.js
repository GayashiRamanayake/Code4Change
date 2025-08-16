import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function InventoryScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Coffee', 'Dairy', 'Sweeteners'];

  const inventoryData = [
    {
      id: '1',
      name: 'Coffee Beans',
      category: 'Coffee',
      quantity: '2.5 kg',
      status: 'GOOD',
      lastUpdated: '2025-01-27',
      lowStock: '1 kg',
    },
    {
      id: '2',
      name: 'Milk',
      category: 'Dairy',
      quantity: '3 L',
      status: 'GOOD',
      lastUpdated: '2025-01-27',
      lowStock: '1000 ml',
    },
    {
      id: '3',
      name: 'Espresso Roast Beans',
      category: 'Coffee',
      quantity: '1.2 kg',
      status: 'LOW',
      lastUpdated: '2025-01-28',
      lowStock: '1 kg',
    },
    {
      id: '4',
      name: 'Whipping Cream',
      category: 'Dairy',
      quantity: '800 ml',
      status: 'LOW',
      lastUpdated: '2025-01-29',
      lowStock: '500 ml',
    },
    {
      id: '5',
      name: 'Sugar Syrup',
      category: 'Sweeteners',
      quantity: '1.5 L',
      status: 'GOOD',
      lastUpdated: '2025-01-27',
      lowStock: '500 ml',
    },
    {
      id: '6',
      name: 'Brown Sugar',
      category: 'Sweeteners',
      quantity: '3 kg',
      status: 'GOOD',
      lastUpdated: '2025-01-26',
      lowStock: '1 kg',
    },
    {
      id: '7',
      name: 'Vanilla Syrup',
      category: 'Sweeteners',
      quantity: '900 ml',
      status: 'LOW',
      lastUpdated: '2025-01-29',
      lowStock: '500 ml',
    },
    {
      id: '8',
      name: 'Chocolate Sauce',
      category: 'Sweeteners',
      quantity: '1.8 kg',
      status: 'GOOD',
      lastUpdated: '2025-01-25',
      lowStock: '500 g',
    },
    {
      id: '9',
      name: 'Oat Milk',
      category: 'Dairy',
      quantity: '2 L',
      status: 'GOOD',
      lastUpdated: '2025-01-27',
      lowStock: '1 L',
    },
    {
      id: '10',
      name: 'Matcha Powder',
      category: 'Coffee',
      quantity: '500 g',
      status: 'LOW',
      lastUpdated: '2025-01-28',
      lowStock: '300 g',
    },
  ];

  const filteredData = inventoryData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchTerm.trim() === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Status dot color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'GOOD':
        return 'green';
      case 'LOW':
        return 'orange';
      case 'OUT':
        return 'red';
      default:
        return 'gray';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <View style={styles.row}>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
        <Text style={styles.itemDate}>
          Last updated: {item.lastUpdated}
        </Text>
        <Text style={styles.lowStock}>Low stock: {item.lowStock}</Text>
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
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Search ingredients..."
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={() => setSearchTerm(searchTerm.trim())} // Enter to search
        />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  addButton: { backgroundColor: '#333', borderRadius: 20, padding: 6 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  categoryRow: { flexDirection: 'row', marginBottom: 16 },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    marginRight: 8,
  },
  categorySelected: { backgroundColor: '#80DEEA' },
  categoryText: { color: '#555' },
  categoryTextSelected: { color: '#fff', fontWeight: 'bold' },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemName: { fontWeight: 'bold', fontSize: 16 },
  itemCategory: { color: '#888', fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  itemQuantity: { fontSize: 15, marginRight: 6 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  statusText: { fontSize: 13 },
  itemDate: { fontSize: 11, color: '#888' },
  lowStock: { fontSize: 11, color: '#999' },
});
