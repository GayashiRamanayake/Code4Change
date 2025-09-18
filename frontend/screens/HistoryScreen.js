// screens/HistoryScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";

const API_URL = "https://neko-and-kopi-default-rtdb.firebaseio.com";

export default function HistoryScreen({ route }) {
  const { filterDate } = route.params;
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/inventory.json`);
      const data = res.data
        ? Object.keys(res.data)
            .map((key) => ({ id: key, ...res.data[key] }))
            .filter((item) => item.updatedAt === filterDate)
        : [];
      setHistoryList(data);
    } catch (err) {
      console.log("Error fetching history:", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <Text style={styles.itemStock}>Stock: {item.stock}</Text>
      <Text style={styles.itemDate}>Updated: {new Date(item.updatedAt).toDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory History - {new Date(filterDate).toDateString()}</Text>
      {historyList.length === 0 ? (
        <Text style={styles.noData}>No history found for this date.</Text>
      ) : (
        <FlatList
          data={historyList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D0E6FA", padding: 16 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  noData: { textAlign: "center", marginTop: 20, color: "#555" },
  itemCard: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#B0C4DE" },
  itemName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  itemCategory: { fontSize: 14, color: "#555" },
  itemStock: { fontSize: 14, color: "#0D1B2A" },
  itemDate: { fontSize: 12, color: "#999", marginTop: 4 },
});
