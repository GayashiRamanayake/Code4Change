// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import LogUsageModal from '../components/LogUsageModal';

// export default function DailyUsageScreen() {
//   const [usageData] = useState([
//     {
//       id: '1',
//       item: 'Coffee Beans',
//       amount: '-0.5 kg',
//       date: 'Jan 27 at 9:30 AM',
//       note: 'Morning batch',
//     },
//     {
//       id: '2',
//       item: 'Milk',
//       amount: '-2.1 L',
//       date: 'Jan 27 at 10:15 AM',
//       note: 'Cappuccinos and lattes',
//     },
//     {
//       id: '3',
//       item: 'Sugar',
//       amount: '-150 g',
//       date: 'Jan 27 at 11:00 AM',
//       note: '',
//     },
//   ]);

//   const [modalVisible, setModalVisible] = useState(false);

//   const renderItem = ({ item }) => (
//     <View style={styles.usageCard}>
//       <View style={styles.usageRow}>
//         <Text style={styles.usageItem}>{item.item}</Text>
//         <Text style={styles.usageAmount}>{item.amount}</Text>
//       </View>
//       <Text style={styles.usageDate}>{item.date}</Text>
//       {item.note ? <Text style={styles.usageNote}>{item.note}</Text> : null}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Daily Usage</Text>

//         <TouchableOpacity style={styles.addButton} onPress={()=>setModalVisible(true)}>
//           <Ionicons name="add" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.subtitle}>Track ingredient consumption</Text>

//       {/* Stats Row */}
//       <View style={styles.statsRow}>
//         <View style={styles.statCard}>
//           <Ionicons name="document-text-outline" size={22} color="#f57c00" />
//           <Text style={styles.statValue}>0</Text>
//           <Text style={styles.statLabel}>Entries Today</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Ionicons name="calendar-outline" size={22} color="#388e3c" />
//           <Text style={styles.statValue}>Jul 26</Text>
//           <Text style={styles.statLabel}>Current Date</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Ionicons name="cube-outline" size={22} color="#fbc02d" />
//           <Text style={styles.statValue}>5</Text>
//           <Text style={styles.statLabel}>Available Items</Text>
//         </View>
//       </View>

//       {/* Recent Usage Section */}
//       <Text style={styles.sectionTitle}>Recent Usage Entries</Text>

//       <FlatList
//         data={usageData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />

//       <LogUsageModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onSubmit={(data) => {
//           console.log("Usage logged:", data);
//           setModalVisible(false);
//         }}
//         inventoryItems={[
//           { id: '1', name: 'Milk' },
//           { id: '2', name: 'Coffee Beans' },
//           { id: '3', name: 'Sugar' },
//         ]}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerTitle: { fontSize: 20, fontWeight: 'bold' },
//   subtitle: { fontSize: 13, color: '#777', marginBottom: 12 },
//   addButton: { backgroundColor: '#333', borderRadius: 20, padding: 6 },
//   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
//   statCard: { alignItems: 'center', flex: 1 },
//   statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
//   statLabel: { fontSize: 12, color: '#777', textAlign: 'center' },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
//   usageCard: {
//     backgroundColor: '#fafafa',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   usageRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   usageItem: { fontSize: 15, fontWeight: '600' },
//   usageAmount: { fontSize: 15, fontWeight: '600', color: 'red' },
//   usageDate: { fontSize: 12, color: '#777', marginTop: 4 },
//   usageNote: { fontSize: 13, color: '#444', fontStyle: 'italic', marginTop: 4 },
// });


// frontend/screens/DailyUsageScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LogUsageModal from '../components/LogUsageModal';

export default function DailyUsageScreen() {
  const [usageData, setUsageData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/logusage"; 
  // ⚠️ Replace localhost with your backend server IP when testing on mobile (e.g., http://192.168.1.x:5000)

  // Fetch usage logs from backend
  const fetchUsageLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new log
  const addUsageLog = async (log) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      const newLog = await response.json();
      setUsageData((prev) => [newLog, ...prev]); // prepend new log
    } catch (error) {
      console.error("Error adding log:", error);
    }
  };

  useEffect(() => {
    fetchUsageLogs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.usageCard}>
      <View style={styles.usageRow}>
        <Text style={styles.usageItem}>{item.item}</Text>
        <Text style={styles.usageAmount}>{item.amount}</Text>
      </View>
      <Text style={styles.usageDate}>{item.date}</Text>
      {item.note ? <Text style={styles.usageNote}>{item.note}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Usage</Text>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Track ingredient consumption</Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="document-text-outline" size={22} color="#f57c00" />
          <Text style={styles.statValue}>{usageData.length}</Text>
          <Text style={styles.statLabel}>Entries Today</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={22} color="#388e3c" />
          <Text style={styles.statValue}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
          <Text style={styles.statLabel}>Current Date</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={22} color="#fbc02d" />
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Available Items</Text>
        </View>
      </View>

      {/* Recent Usage Section */}
      <Text style={styles.sectionTitle}>Recent Usage Entries</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={usageData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <LogUsageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          addUsageLog(data);
          setModalVisible(false);
        }}
        inventoryItems={[
          { id: '1', name: 'Milk' },
          { id: '2', name: 'Coffee Beans' },
          { id: '3', name: 'Sugar' },
        ]}
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
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  statLabel: { fontSize: 12, color: '#777', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  usageCard: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  usageRow: { flexDirection: 'row', justifyContent: 'space-between' },
  usageItem: { fontSize: 15, fontWeight: '600' },
  usageAmount: { fontSize: 15, fontWeight: '600', color: 'red' },
  usageDate: { fontSize: 12, color: '#777', marginTop: 4 },
  usageNote: { fontSize: 13, color: '#444', fontStyle: 'italic', marginTop: 4 },
});
