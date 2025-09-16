// // import React, { useState } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import LogUsageModal from '../components/LogUsageModal';

// // export default function DailyUsageScreen() {
// //   const [usageData] = useState([
// //     {
// //       id: '1',
// //       item: 'Coffee Beans',
// //       amount: '-0.5 kg',
// //       date: 'Jan 27 at 9:30 AM',
// //       note: 'Morning batch',
// //     },
// //     {
// //       id: '2',
// //       item: 'Milk',
// //       amount: '-2.1 L',
// //       date: 'Jan 27 at 10:15 AM',
// //       note: 'Cappuccinos and lattes',
// //     },
// //     {
// //       id: '3',
// //       item: 'Sugar',
// //       amount: '-150 g',
// //       date: 'Jan 27 at 11:00 AM',
// //       note: '',
// //     },
// //   ]);

// //   const [modalVisible, setModalVisible] = useState(false);

// //   const renderItem = ({ item }) => (
// //     <View style={styles.usageCard}>
// //       <View style={styles.usageRow}>
// //         <Text style={styles.usageItem}>{item.item}</Text>
// //         <Text style={styles.usageAmount}>{item.amount}</Text>
// //       </View>
// //       <Text style={styles.usageDate}>{item.date}</Text>
// //       {item.note ? <Text style={styles.usageNote}>{item.note}</Text> : null}
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>Daily Usage</Text>

// //         <TouchableOpacity style={styles.addButton} onPress={()=>setModalVisible(true)}>
// //           <Ionicons name="add" size={22} color="#fff" />
// //         </TouchableOpacity>
// //       </View>
// //       <Text style={styles.subtitle}>Track ingredient consumption</Text>

// //       {/* Stats Row */}
// //       <View style={styles.statsRow}>
// //         <View style={styles.statCard}>
// //           <Ionicons name="document-text-outline" size={22} color="#f57c00" />
// //           <Text style={styles.statValue}>0</Text>
// //           <Text style={styles.statLabel}>Entries Today</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Ionicons name="calendar-outline" size={22} color="#388e3c" />
// //           <Text style={styles.statValue}>Jul 26</Text>
// //           <Text style={styles.statLabel}>Current Date</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Ionicons name="cube-outline" size={22} color="#fbc02d" />
// //           <Text style={styles.statValue}>5</Text>
// //           <Text style={styles.statLabel}>Available Items</Text>
// //         </View>
// //       </View>

// //       {/* Recent Usage Section */}
// //       <Text style={styles.sectionTitle}>Recent Usage Entries</Text>

// //       <FlatList
// //         data={usageData}
// //         renderItem={renderItem}
// //         keyExtractor={(item) => item.id}
// //         contentContainerStyle={{ paddingBottom: 20 }}
// //       />

// //       <LogUsageModal
// //         visible={modalVisible}
// //         onClose={() => setModalVisible(false)}
// //         onSubmit={(data) => {
// //           console.log("Usage logged:", data);
// //           setModalVisible(false);
// //         }}
// //         inventoryItems={[
// //           { id: '1', name: 'Milk' },
// //           { id: '2', name: 'Coffee Beans' },
// //           { id: '3', name: 'Sugar' },
// //         ]}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
// //   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// //   headerTitle: { fontSize: 20, fontWeight: 'bold' },
// //   subtitle: { fontSize: 13, color: '#777', marginBottom: 12 },
// //   addButton: { backgroundColor: '#333', borderRadius: 20, padding: 6 },
// //   statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
// //   statCard: { alignItems: 'center', flex: 1 },
// //   statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
// //   statLabel: { fontSize: 12, color: '#777', textAlign: 'center' },
// //   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
// //   usageCard: {
// //     backgroundColor: '#fafafa',
// //     padding: 12,
// //     borderRadius: 8,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#eee',
// //   },
// //   usageRow: { flexDirection: 'row', justifyContent: 'space-between' },
// //   usageItem: { fontSize: 15, fontWeight: '600' },
// //   usageAmount: { fontSize: 15, fontWeight: '600', color: 'red' },
// //   usageDate: { fontSize: 12, color: '#777', marginTop: 4 },
// //   usageNote: { fontSize: 13, color: '#444', fontStyle: 'italic', marginTop: 4 },
// // });


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { db } from "../firebaseConfig"; // ✅ use 'db' from your frontend config
// import {
//   ref,
//   onValue,
//   off,
//   query,
//   orderByChild,
//   equalTo,
//   push,
// } from "firebase/database";
// import LogUsageModal from "../components/LogUsageModal";

// export default function DailyUsageScreen() {
//   const [usageData, setUsageData] = useState([]);
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [availableCount, setAvailableCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);

//   // YYYY-MM-DD for querying
//   const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

//   // ---- Load inventory (read-only) ----
//   useEffect(() => {
//     const invRef = ref(db, "inventory"); // adjust path if your inventory lives elsewhere
//     const unsubInv = onValue(
//       invRef,
//       (snap) => {
//         if (!snap.exists()) {
//           setInventoryItems([]);
//           setAvailableCount(0);
//           return;
//         }
//         const raw = snap.val();
//         const list = Object.entries(raw).map(([id, v]) => ({
//           id,
//           name: v?.name ?? id,
//           stock: typeof v?.stock === "number" ? v.stock : Number(v?.stock ?? 0),
//           unit: v?.unit ?? "",
//         }));
//         setInventoryItems(list);
//         setAvailableCount(list.filter((i) => (i.stock ?? 0) > 0).length);
//       },
//       (err) => console.warn("Inventory read error:", err)
//     );
//     return () => off(invRef, "value", unsubInv);
//   }, []);

//   // ---- Load today's usage logs ----
//   useEffect(() => {
//     // we query by dateStr to only get today’s entries
//     const q = query(ref(db, "logUsage"), orderByChild("dateStr"), equalTo(todayStr));
//     const unsubLogs = onValue(
//       q,
//       (snap) => {
//         if (!snap.exists()) {
//           setUsageData([]);
//           setLoading(false);
//           return;
//         }
//         const obj = snap.val();
//         const arr = Object.entries(obj)
//           .map(([id, v]) => ({ id, ...v }))
//           // newest first
//           .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
//         setUsageData(arr);
//         setLoading(false);
//       },
//       (err) => {
//         console.warn("Log read error:", err);
//         setLoading(false);
//       }
//     );
//     // cleanup
//     return () => off(ref(db, "logUsage"), "value", unsubLogs);
//   }, [todayStr]);

//   // ---- Add usage log ----
//   const addUsageLog = async ({ itemId, itemName, amount, note }) => {
//     const trimmed = String(amount).trim();
//     if (!itemId || !itemName || !trimmed) return;

//     const numeric = Number(trimmed);
//     if (Number.isNaN(numeric)) return;

//     const payload = {
//       itemId,
//       itemName,
//       amount: numeric,     // store as positive number; display with "-" in UI if you want
//       note: note ?? "",
//       dateISO: new Date().toISOString(),
//       dateStr: todayStr,   // <= critical for the query
//     };

//     try {
//       await push(ref(db, "logUsage"), payload);
//       // onValue listener updates the list automatically
//     } catch (e) {
//       console.warn("Failed to add log:", e);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.usageCard}>
//       <View style={styles.usageRow}>
//         <Text style={styles.usageItem}>{item.itemName}</Text>
//         <Text style={styles.usageAmount}>-{item.amount}</Text>
//       </View>
//       <Text style={styles.usageDate}>
//         {new Date(item.dateISO).toLocaleTimeString()}
//       </Text>
//       {item.note ? <Text style={styles.usageNote}>{item.note}</Text> : null}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Daily Usage</Text>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => setModalVisible(true)}
//         >
//           <Ionicons name="add" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Stats Row (today + available items) */}
//       <View style={styles.statsRow}>
//         <View style={styles.statCard}>
//           <Ionicons name="calendar-outline" size={20} />
//           <Text style={styles.statValue}>
//             {new Date().toLocaleDateString(undefined, {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </Text>
//           <Text style={styles.statLabel}>Current Date</Text>
//         </View>

//         <View style={styles.statCard}>
//           <Ionicons name="cube-outline" size={20} />
//           <Text style={styles.statValue}>{availableCount}</Text>
//           <Text style={styles.statLabel}>Available Items</Text>
//         </View>

//         <View style={styles.statCard}>
//           <Ionicons name="document-text-outline" size={20} />
//           <Text style={styles.statValue}>{usageData.length}</Text>
//           <Text style={styles.statLabel}>Entries Today</Text>
//         </View>
//       </View>

//       {/* List */}
//       <Text style={styles.sectionTitle}>Recent Usage Entries</Text>
//       {loading ? (
//         <ActivityIndicator size="large" />
//       ) : usageData.length === 0 ? (
//         <Text style={{ color: "#777" }}>No usage recorded today.</Text>
//       ) : (
//         <FlatList
//           data={usageData}
//           renderItem={renderItem}
//           keyExtractor={(it) => it.id}
//           contentContainerStyle={{ paddingBottom: 24 }}
//         />
//       )}

//       {/* Modal */}
//       <LogUsageModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         inventoryItems={inventoryItems}
//         onSubmit={(data) => {
//           addUsageLog(data);
//           setModalVisible(false);
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 16 },
//   header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   headerTitle: { fontSize: 20, fontWeight: "bold" },
//   addButton: { backgroundColor: "#333", borderRadius: 20, padding: 6 },
//   statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, marginBottom: 8 },
//   statCard: { alignItems: "center", flex: 1 },
//   statValue: { fontSize: 15, fontWeight: "600", marginTop: 2 },
//   statLabel: { fontSize: 12, color: "#777" },
//   sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
//   usageCard: { backgroundColor: "#fafafa", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
//   usageRow: { flexDirection: "row", justifyContent: "space-between" },
//   usageItem: { fontSize: 15, fontWeight: "600" },
//   usageAmount: { fontSize: 15, fontWeight: "600", color: "red" },
//   usageDate: { fontSize: 12, color: "#777", marginTop: 4 },
//   usageNote: { fontSize: 13, color: "#444", fontStyle: "italic", marginTop: 4 },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import LogUsageModal from "../components/LogUsageModal";

export default function DailyUsageScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [currentStock, setCurrentStock] = useState({});

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const todayDisplay = today.toDateString(); // Mon Sep 16 2025

  // Fetch inventory with stock values
  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:5000/inventory");
      const data = await res.json();
      setInventoryItems(data);

      // build stock map for quick lookup
      const stockMap = {};
      data.forEach((item) => {
        stockMap[item.id] = item.stock;
      });
      setCurrentStock(stockMap);
    } catch (err) {
      Alert.alert("Error", "Failed to load inventory");
    }
  };

  // Fetch logs for today
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/logUsage?date=${todayStr}`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load usage logs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
    fetchLogs();
  }, []);

  const handleAddUsage = async (usageData) => {
    try {
      const res = await fetch("http://localhost:5000/logUsage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usageData),
      });

      const result = await res.json();
      if (!res.ok) {
        Alert.alert("Error", result.error || "Failed to log usage");
        return;
      }

      if (result.lowStock) {
        Alert.alert("⚠️ Low Stock Alert", `${result.itemName} has reached low stock!`);
      }

      setModalVisible(false);
      fetchLogs();
      fetchInventory();
    } catch (err) {
      Alert.alert("Error", "Failed to submit usage");
    }
  };

  const handleGenerateReport = () => {
    Alert.alert("📊 Report Generated", "Your usage report for today has been generated!");
  };

  const renderLog = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.logText}>
        <Text style={styles.logLabel}>Item:</Text> {item.itemName}
      </Text>
      <Text style={styles.logText}>
        <Text style={styles.logLabel}>Amount:</Text> {item.amount}
      </Text>
      {item.note ? (
        <Text style={styles.logText}>
          <Text style={styles.logLabel}>Note:</Text> {item.note}
        </Text>
      ) : null}
      <Text style={styles.logDate}>
        {new Date(item.date).toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderStock = ({ item }) => (
    <View style={styles.stockCard}>
      <Text style={styles.stockName}>{item.name}</Text>
      <Text style={styles.stockQty}>
        {currentStock[item.id] ?? 0} {item.unit || ""}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Date */}
      <Text style={styles.header}>📘 Daily Usage</Text>
      <Text style={styles.subHeader}>Today: {todayDisplay}</Text>

      {/* Current Stock */}
      <Text style={styles.sectionTitle}>📦 Current Stock</Text>
      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => item.id}
        renderItem={renderStock}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Usage Logs */}
      <Text style={styles.sectionTitle}>📝 Usage Logs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLog}
          ListEmptyComponent={<Text style={styles.emptyText}>No usage recorded today.</Text>}
        />
      )}

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>+ Add Usage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.reportButton]}
          onPress={handleGenerateReport}
        >
          <Text style={styles.buttonText}>📊 Generate Report</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <LogUsageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        inventoryItems={inventoryItems}
        onSubmit={handleAddUsage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F9FF" },
  header: { fontSize: 24, fontWeight: "bold", color: "#007BFF", marginBottom: 4 },
  subHeader: { fontSize: 14, color: "#555", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#0056b3", marginVertical: 8 },

  // Stock cards
  stockCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
    minWidth: 100,
  },
  stockName: { fontSize: 14, fontWeight: "600", color: "#007BFF" },
  stockQty: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 4 },

  // Log cards
  logCard: {
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logText: { fontSize: 14, color: "#333", marginBottom: 2 },
  logLabel: { fontWeight: "bold", color: "#007BFF" },
  logDate: { fontSize: 12, color: "#888", marginTop: 4 },

  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },

  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  addButton: { backgroundColor: "#007BFF" },
  reportButton: { backgroundColor: "#0056b3" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
