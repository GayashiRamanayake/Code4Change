import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";

const API_URL = "https://neko-and-kopi-default-rtdb.firebaseio.com";

export default function HistoryScreen({ route }) {
  const { filterDate } = route.params; // selected date from DatePickerModal
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [filterDate]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/inventory.json`);
      const data = res.data
        ? Object.keys(res.data).map((key) => ({
            id: key,
            ...res.data[key],
          }))
        : [];

      // Filter items updated on the selected date
      const filtered = data
        .map((item) => {
          if (item.history) {
            // Get history entry for selected date
            const entry = item.history.find((h) => h.date === filterDate);
            if (entry) {
              return {
                id: item.id,
                name: item.name,
                category: item.category,
                stockBefore: entry.stockBefore || 0,
                stockUsed: entry.stockUsed || 0,
                stock: entry.stock || 0,
                threshold: item.threshold || 5,
              };
            }
          }
          return null;
        })
        .filter((item) => item !== null);

      setHistoryData(filtered);
    } catch (err) {
      console.log("Error fetching history:", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.stockBefore}</Text>
      <Text style={styles.cell}>{item.stockUsed}</Text>
      <Text style={styles.cell}>{item.stock}</Text>
      <Text
        style={[
          styles.cell,
          { color: item.stock <= item.threshold ? "#D32F2F" : "#4CAF50" },
        ]}
      >
        {item.stock <= item.threshold ? "LOW" : "GOOD"}
      </Text>
    </View>
  );

  // Totals
  const totalStockBefore = historyData.reduce(
    (sum, item) => sum + item.stockBefore,
    0
  );
  const totalStockUsed = historyData.reduce(
    (sum, item) => sum + item.stockUsed,
    0
  );
  const totalStockAfter = historyData.reduce((sum, item) => sum + item.stock, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory History - {filterDate}</Text>

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Category</Text>
        <Text style={styles.headerCell}>Before</Text>
        <Text style={styles.headerCell}>Used</Text>
        <Text style={styles.headerCell}>After</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {historyData.length > 0 && (
        <View style={styles.totalsRow}>
          <Text style={styles.totalsCell}>Totals</Text>
          <Text style={styles.totalsCell}></Text>
          <Text style={styles.totalsCell}>{totalStockBefore}</Text>
          <Text style={styles.totalsCell}>{totalStockUsed}</Text>
          <Text style={styles.totalsCell}>{totalStockAfter}</Text>
          <Text style={styles.totalsCell}></Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#D0E6FA" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#0D1B2A" },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 6,
  },
  headerCell: { flex: 1, fontWeight: "bold", fontSize: 12, color: "#0D1B2A" },
  row: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#ccc" },
  cell: { flex: 1, fontSize: 12, color: "#0D1B2A" },
  totalsRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTopWidth: 2,
    borderColor: "#333",
    marginTop: 8,
  },
  totalsCell: { flex: 1, fontWeight: "bold", color: "#0D1B2A" },
});
