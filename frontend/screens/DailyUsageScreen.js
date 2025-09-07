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


import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ref, push, query, orderByChild, equalTo, get } from "firebase/database";
import { database } from "../firebaseConfig"; // make sure path is correct
import LogUsageModal from "../components/LogUsageModal";

export default function DailyUsageScreen() {
  const [usageData, setUsageData] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Fetch logs for today
  const fetchUsageLogs = async () => {
    setLoading(true);
    try {
      const logsRef = ref(database, "logUsage");
      const logsQuery = query(logsRef, orderByChild("dateStr"), equalTo(todayStr));
      const snapshot = await get(logsQuery);
      if (snapshot.exists()) {
        const logs = Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...value }));
        setUsageData(logs.reverse()); // latest first
      } else {
        setUsageData([]);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
    setLoading(false);
  };

  // Fetch inventory (dummy for now, replace with actual inventory if you have it)
  const fetchInventory = () => {
    // Example items
    setInventoryItems([
      { id: "1", name: "Milk" },
      { id: "2", name: "Coffee Beans" },
      { id: "3", name: "Sugar" }
    ]);
  };

  useEffect(() => {
    fetchInventory();
    fetchUsageLogs();
  }, []);

  // Add new log
  const addUsageLog = async (log) => {
    try {
      const logsRef = ref(database, "logUsage");
      const newLog = {
        ...log,
        date: new Date().toISOString(),
        dateStr: todayStr
      };
      const pushedLogRef = await push(logsRef, newLog);
      setUsageData(prev => [{ id: pushedLogRef.key, ...newLog }, ...prev]);
    } catch (err) {
      console.error("Error adding log:", err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.usageCard}>
      <View style={styles.usageRow}>
        <Text style={styles.usageItem}>{item.itemName}</Text>
        <Text style={styles.usageAmount}>{item.amount}</Text>
      </View>
      <Text style={styles.usageDate}>{new Date(item.date).toLocaleTimeString()}</Text>
      {item.note ? <Text style={styles.usageNote}>{item.note}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Usage</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>

      <Text style={styles.sectionTitle}>Recent Usage Entries</Text>
      {loading ? <ActivityIndicator size="large" /> :
        <FlatList
          data={usageData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      }

      <LogUsageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        inventoryItems={inventoryItems}
        onSubmit={(data) => { addUsageLog(data); setModalVisible(false); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 12 },
  addButton: { backgroundColor: "#333", padding: 6, borderRadius: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  usageCard: { backgroundColor: "#fafafa", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
  usageRow: { flexDirection: "row", justifyContent: "space-between" },
  usageItem: { fontSize: 15, fontWeight: "600" },
  usageAmount: { fontSize: 15, fontWeight: "600", color: "red" },
  usageDate: { fontSize: 12, color: "#777", marginTop: 4 },
  usageNote: { fontSize: 13, color: "#444", fontStyle: "italic", marginTop: 4 }
});
