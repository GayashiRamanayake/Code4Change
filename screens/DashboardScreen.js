// screens/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Neko & Kopi</Text>
      <Text style={styles.subtitle}>Inventory Dashboard</Text>

      {/* Top Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#E7F6EA' }]}>
          <MaterialCommunityIcons name="cube-outline" size={30} color="#2E7D32" />
          <Text style={styles.statNumber}>4</Text>
          <Text>Total Items</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF8E1' }]}>
          <MaterialCommunityIcons name="alert-outline" size={30} color="#FF9800" />
          <Text style={styles.statNumber}>0</Text>
          <Text>Low Stock</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
          <MaterialCommunityIcons name="trending-up" size={30} color="#E53935" />
          <Text style={styles.statNumber}>1</Text>
          <Text>Quality Issues</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#B2EBF2' }]}
          onPress={() => navigation.navigate('Inventory')}
        >
          <MaterialCommunityIcons name="plus-box" size={24} color="#00796B" />
          <Text>Add Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#B2EBF2' }]}
          onPress={() => navigation.navigate('Daily Usage')}
        >
          <MaterialCommunityIcons name="clipboard-text" size={24} color="#00796B" />
          <Text>Log Usage</Text>
        </TouchableOpacity>
      </View>

      {/* Current Inventory */}
      <Text style={styles.sectionTitle}>Current Inventory</Text>
      <View style={styles.inventoryItem}>
        <Text style={styles.itemName}>Coffee Beans</Text>
        <Text style={styles.itemStatus}>GOOD</Text>
      </View>
      <View style={styles.inventoryItem}>
        <Text style={styles.itemName}>Milk</Text>
        <Text style={styles.itemStatus}>GOOD</Text>
      </View>
      <View style={styles.inventoryItem}>
        <Text style={styles.itemName}>Sugar</Text>
        <Text style={[styles.itemStatus, { color: '#FFC107' }]}>FAIR</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#555', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, alignItems: 'center', padding: 15, borderRadius: 10, marginHorizontal: 5 },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 8, marginHorizontal: 5 },
  inventoryItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  itemName: { fontSize: 16 },
  itemStatus: { fontWeight: 'bold', color: 'green' },
});
