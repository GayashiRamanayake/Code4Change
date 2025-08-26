import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InventoryScreen() {
  const [inventoryData] = useState([
    { id: '1', name: 'Tomatoes', category: 'Vegetables', stock: '50 kg', status: 'good', value: '$175.00', min: '10 kg', max: '100 kg' },
    { id: '2', name: 'Ground Beef', category: 'Meat', stock: '25 kg', status: 'good', value: '$204.75', min: '5 kg', max: '50 kg' },
    { id: '3', name: 'Mozzarella Cheese', category: 'Dairy', stock: '15 kg', status: 'good', value: '$315.25', min: '5 kg', max: '30 kg' },
    { id: '4', name: 'Flour', category: 'Bakery', stock: '80 kg', status: 'good', value: '$100.09', min: '20 kg', max: '120 kg' },
    { id: '5', name: 'Olive Oil', category: 'Oils', stock: '12 L', status: 'good', value: '$118.18', min: '5 L', max: '25 L' },
    { id: '6', name: 'Chicken Breast', category: 'Meat', stock: '40 kg', status: 'good', value: '$310.00', min: '10 kg', max: '70 kg' },
    { id: '7', name: 'Lettuce', category: 'Vegetables', stock: '30 heads', status: 'good', value: '$45.00', min: '5 heads', max: '60 heads' },
    { id: '8', name: 'Butter', category: 'Dairy', stock: '8 kg', status: 'good', value: '$88.00', min: '2 kg', max: '20 kg' },
    { id: '9', name: 'Sugar', category: 'Pantry', stock: '60 kg', status: 'good', value: '$120.00', min: '15 kg', max: '80 kg' },
    { id: '10', name: 'Salt', category: 'Pantry', stock: '25 kg', status: 'good', value: '$30.00', min: '5 kg', max: '40 kg' },
    { id: '11', name: 'Black Pepper', category: 'Spices', stock: '5 kg', status: 'good', value: '$60.00', min: '1 kg', max: '10 kg' },
    { id: '12', name: 'Rice', category: 'Grains', stock: '100 kg', status: 'good', value: '$200.00', min: '30 kg', max: '150 kg' },
    { id: '13', name: 'Pasta', category: 'Grains', stock: '40 kg', status: 'good', value: '$90.00', min: '10 kg', max: '70 kg' },
    { id: '14', name: 'Eggs', category: 'Dairy', stock: '200 pcs', status: 'good', value: '$60.00', min: '50 pcs', max: '300 pcs' },
    { id: '15', name: 'Yeast', category: 'Bakery', stock: '2 kg', status: 'good', value: '$20.00', min: '500 g', max: '5 kg' },
    { id: '16', name: 'Carrots', category: 'Vegetables', stock: '25 kg', status: 'good', value: '$55.00', min: '5 kg', max: '50 kg' },
    { id: '17', name: 'Onions', category: 'Vegetables', stock: '40 kg', status: 'good', value: '$80.00', min: '10 kg', max: '70 kg' },
    { id: '18', name: 'Garlic', category: 'Vegetables', stock: '10 kg', status: 'good', value: '$40.00', min: '2 kg', max: '20 kg' },
    { id: '19', name: 'Fish Fillets', category: 'Seafood', stock: '20 kg', status: 'good', value: '$250.00', min: '5 kg', max: '40 kg' },
    { id: '20', name: 'Shrimp', category: 'Seafood', stock: '15 kg', status: 'good', value: '$180.00', min: '5 kg', max: '30 kg' },
  ]);


  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cellName}>{item.name}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.stock}</Text>
      <Text style={[styles.cellStatus, { color: item.status === 'good' ? 'green' : 'red' }]}>
        {item.status}
      </Text>
      <Text style={styles.cell}>{item.value}</Text>
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
      <Text style={styles.subtitle}>Track ingredient consumption</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.actionText}>+ Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}>
          <Text style={styles.actionText}>Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#64B5F6' }]}>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Current Inventory Section */}
      <Text style={styles.sectionTitle}>Current Inventory</Text>
      <Text style={styles.sectionSubtitle}>Manage your current stock levels</Text>

      {/* Table Header */}
      <View style={[styles.row, styles.tableHeader]}>
        <Text style={styles.cellHeader}>ITEM</Text>
        <Text style={styles.cellHeader}>CATEGORY</Text>
        <Text style={styles.cellHeader}>STOCK</Text>
        <Text style={styles.cellHeader}>STATUS</Text>
        <Text style={styles.cellHeader}>VALUE</Text>
      </View>

      {/* List */}
      <FlatList
        data={inventoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#777', marginBottom: 12 },
  addButton: { backgroundColor: '#333', borderRadius: 20, padding: 6 },
  actionRow: { flexDirection: 'row', marginBottom: 12 },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  actionText: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  sectionSubtitle: { fontSize: 13, color: '#777', marginBottom: 10 },
  tableHeader: { backgroundColor: '#f5f5f5', borderRadius: 6, paddingVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cellHeader: { flex: 1, fontWeight: 'bold', fontSize: 12 },
  cellName: { flex: 1, fontWeight: '600', fontSize: 14 },
  cell: { flex: 1, fontSize: 13 },
  cellStatus: { flex: 1, fontWeight: 'bold', textTransform: 'uppercase' },
});
