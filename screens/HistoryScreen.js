// HISTORYSCREEN.JS (CURRENT MOCK VERSION)
// ------------------------------------------------------------
// This file renders the "Inventory History" screen.
// It receives a date from navigation, filters a hard-coded array,
// and shows the rows in a table-like list.
// We'll later replace the hard-coded array with Firebase Realtime DB calls.

import React, { useState, useEffect } from 'react';        // React + two hooks for state and side-effects
import { View, Text, StyleSheet, FlatList } from 'react-native'; // Core RN UI components
import { TouchableOpacity } from 'react-native';            // Button-like component for "Export"

// Default export: this component is used by your navigator/router
export default function HistoryScreen({ route }) {
  // Pull "date" that was passed from the previous screen:
  // navigation.navigate('History', { date: selectedDate })
  const { date } = route.params;

  // inventoryData is what we render. Starts empty [] until we load/filter.
  const [inventoryData, setInventoryData] = useState([]);

  // useEffect runs after the first render and whenever [date] changes.
  // Here it builds the mock data and filters it by the selected date.
  useEffect(() => {
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // HARD-CODED DEMO DATA (FRONTEND ONLY)
    // For backend: REMOVE this array and fetch from Firebase instead.
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const allInventory = [
      { id: '1', name: 'Tomatoes', category: 'Vegetables', stock: '50 kg', value: '$175.00', usage: '5 kg', lastUpdated: '2025-01-27' },
      { id: '2', name: 'Ground Beef', category: 'Meat', stock: '25 kg', value: '$204.75', usage: '2 kg', lastUpdated: '2025-01-27' },
      { id: '3', name: 'Mozzarella Cheese', category: 'Dairy', stock: '15 kg', value: '$315.25', usage: '1 kg', lastUpdated: '2025-01-27' },
      { id: '4', name: 'Flour', category: 'Bakery', stock: '80 kg', value: '$100.09', usage: '10 kg', lastUpdated: '2025-01-27' },
      { id: '5', name: 'Olive Oil', category: 'Oils', stock: '12 L', value: '$118.18', usage: '0.5 L', lastUpdated: '2025-01-27' },
      { id: '6', name: 'Chicken Breast', category: 'Meat', stock: '40 kg', value: '$310.00', usage: '5 kg', lastUpdated: '2025-01-27' },
      { id: '7', name: 'Lettuce', category: 'Vegetables', stock: '30 heads', value: '$45.00', usage: '3 heads', lastUpdated: '2025-01-27' },
      { id: '8', name: 'Butter', category: 'Dairy', stock: '8 kg', value: '$88.00', usage: '1 kg', lastUpdated: '2025-01-27' },
      { id: '9', name: 'Sugar', category: 'Pantry', stock: '60 kg', value: '$120.00', usage: '4 kg', lastUpdated: '2025-01-27' },
      { id: '10', name: 'Salt', category: 'Pantry', stock: '25 kg', value: '$30.00', usage: '1 kg', lastUpdated: '2025-01-27' },
      { id: '11', name: 'Black Pepper', category: 'Spices', stock: '5 kg', value: '$60.00', usage: '0.2 kg', lastUpdated: '2025-01-27' },
      { id: '12', name: 'Rice', category: 'Grains', stock: '100 kg', value: '$200.00', usage: '15 kg', lastUpdated: '2025-01-27' },
      { id: '13', name: 'Pasta', category: 'Grains', stock: '40 kg', value: '$90.00', usage: '5 kg', lastUpdated: '2025-01-27' },
      { id: '14', name: 'Eggs', category: 'Dairy', stock: '200 pcs', value: '$60.00', usage: '20 pcs', lastUpdated: '2025-01-27' },
      { id: '15', name: 'Yeast', category: 'Bakery', stock: '2 kg', value: '$20.00', usage: '0.2 kg', lastUpdated: '2025-01-27' },
      { id: '16', name: 'Carrots', category: 'Vegetables', stock: '25 kg', value: '$55.00', usage: '3 kg', lastUpdated: '2025-01-27' },
      { id: '17', name: 'Onions', category: 'Vegetables', stock: '40 kg', value: '$80.00', usage: '5 kg', lastUpdated: '2025-01-27' },
      { id: '18', name: 'Garlic', category: 'Vegetables', stock: '10 kg', value: '$40.00', usage: '1 kg', lastUpdated: '2025-01-27' },
      { id: '19', name: 'Fish Fillets', category: 'Seafood', stock: '20 kg', value: '$250.00', usage: '2 kg', lastUpdated: '2025-01-27' },
      { id: '20', name: 'Shrimp', category: 'Seafood', stock: '15 kg', value: '$180.00', usage: '1.5 kg', lastUpdated: '2025-01-27' },
    ];

    // Convert Date object to "YYYY-MM-DD" string.
    // NOTE: toISOString() is UTC. If you want Sri Lanka local date keys,
    // prefer building the string with getFullYear()/getMonth()/getDate() later.
    const selectedDateStr = date.toISOString().split("T")[0];

    // Filter array where lastUpdated equals the selected date string.
    // Algorithm: linear scan O(n). OK for small lists.
    // BACKEND PLAN: avoid filter on client; store each date under its own key in Firebase.
    const filtered = allInventory.filter(item => item.lastUpdated === selectedDateStr);

    // Save filtered rows to state -> triggers re-render of the list.
    setInventoryData(filtered);
  }, [date]); // Dependency array: re-run effect when "date" changes.

  // Render one row in the table (called by FlatList for each item).
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cellName}>{item.name}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.stock}</Text>
      <Text style={styles.cell}>{item.usage}</Text>
      <Text style={styles.cell}>{item.value}</Text>
    </View>
  );

  // Main UI
  return (
  <View style={styles.container}>
    {/* Header area */}
    <View style={styles.header}>
      {/* NOTE: styles.headerRow is referenced but NOT defined below.
          RN ignores undefined style, so no crash, but define it if you need layout. */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Inventory History</Text>
        {/* Date shown to the user */}
        <Text style={styles.subtitle}>
          Showing inventory for: {date.toISOString().split("T")[0]}
        </Text>

        {/* Export button — RIGHT NOW it just logs to console.
           BACKEND PLAN: call your API (or generate client-side CSV) */}
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => {
            console.log('Export clicked');
          }}
        >
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Table header labels (static) */}
    <View style={[styles.row, styles.tableHeader]}>
      <Text style={styles.cellHeader}>ITEM</Text>
      <Text style={styles.cellHeader}>CATEGORY</Text>
      <Text style={styles.cellHeader}>STOCK</Text>
      <Text style={styles.cellHeader}>USAGE</Text>
      <Text style={styles.cellHeader}>VALUE</Text>
    </View>

    {/* The data rows */}
    <FlatList
      data={inventoryData}               // array from state
      renderItem={renderItem}            // how to paint each row
      keyExtractor={(item) => item.id}   // unique key for diffing rows
      contentContainerStyle={{ paddingBottom: 80 }} // extra bottom space
    />

    {/* Empty state if nothing found for that date */}
    {inventoryData.length === 0 && (
      <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 35 }}>
        No inventory records found for this date.
      </Text>
    )}

  </View>
);

} // end component

// Stylesheet for layout and text. Flex rows are used to fake a "table".
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#777', marginBottom: 16 },

  // Table header row visuals
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f5f5f5', 
    borderRadius: 8, 
    paddingVertical: 12, 
    paddingHorizontal: 6,
    borderWidth: 1, 
    borderColor: '#ccc',
    marginBottom: 8,
  },

  // Each data row
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 0,
    borderBottomWidth: 1, 
    borderColor: '#ccc',
    paddingVertical: 12, 
    paddingHorizontal: 6,
  },

  // Unused container right now (safe to delete or wire it up)
  exportButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16, 
  },

  // Green export button styles
  exportButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    elevation: 2,
    marginLeft: 250,
    marginBottom: 3,
  },

  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Table text cells (equal flex so they line up like columns)
  cellHeader: { flex: 1, fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  cellName:   { flex: 1, fontWeight: '600', fontSize: 15, textAlign: 'center' },
  cell:       { flex: 1, fontSize: 14, textAlign: 'center' },
});

