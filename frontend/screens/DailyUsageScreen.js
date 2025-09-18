import React, { useEffect, useMemo, useState } from "react"; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import {
  ref,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  push,
  update,
} from "firebase/database";
import LogUsageModal from "../components/LogUsageModal";

export default function DailyUsageScreen() {
  const [usageData, setUsageData] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // ---- Load inventory ----
  useEffect(() => {
    const invRef = ref(db, "inventory");
    const unsubInv = onValue(
      invRef,
      (snap) => {
        if (!snap.exists()) {
          setInventoryItems([]);
          setAvailableCount(0);
          return;
        }
        const raw = snap.val();
        const list = Object.entries(raw).map(([id, v]) => {
          // Use top-level stock if exists, else fallback to latest history
          let currentStock = typeof v?.stock === "number"
            ? v.stock
            : v?.history
            ? Object.values(v.history).slice(-1)[0]?.stock ?? 0
            : 0;

          return {
            id,
            name: v?.name ?? id,
            stock: currentStock,
            unit: v?.unit ?? "",
            threshold: typeof v?.threshold === "number" ? v.threshold : Number(v?.threshold ?? 0),
          };
        });
        setInventoryItems(list);
        setAvailableCount(list.filter((i) => (i.stock ?? 0) > 0).length);
      },
      (err) => console.warn("Inventory read error:", err)
    );
    return () => off(invRef, "value", unsubInv);
  }, []);

  // ---- Load today's usage logs ----
  useEffect(() => {
    const q = query(ref(db, "logUsage"), orderByChild("dateStr"), equalTo(todayStr));
    const unsubLogs = onValue(
      q,
      (snap) => {
        if (!snap.exists()) {
          setUsageData([]);
          setLoading(false);
          return;
        }
        const obj = snap.val();
        const arr = Object.entries(obj)
          .map(([id, v]) => ({ id, ...v }))
          .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
        setUsageData(arr);
        setLoading(false);
      },
      (err) => {
        console.warn("Log read error:", err);
        setLoading(false);
      }
    );
    return () => off(ref(db, "logUsage"), "value", unsubLogs);
  }, [todayStr]);

  // ---- Add usage log + check threshold ----
  const addUsageLog = async ({ itemId, itemName, amount, note }) => {
    const trimmed = String(amount).trim();
    if (!itemId || !itemName || !trimmed) return;
    const numeric = Number(trimmed);
    if (Number.isNaN(numeric)) return;

    const payload = {
      itemId,
      itemName,
      amount: numeric,
      note: note ?? "",
      dateISO: new Date().toISOString(),
      dateStr: todayStr,
    };

    try {
      // 1. Add usage log
      await push(ref(db, "logUsage"), payload);

      // 2. Update stock
      const item = inventoryItems.find((i) => i.id === itemId);
      if (item) {
        const newStock = (item.stock ?? 0) - numeric;
        await update(ref(db, `inventory/${itemId}`), { stock: newStock });

        // 3. Check threshold
        if (newStock <= item.threshold) {
          Alert.alert(
            "Low Stock Warning 🚨",
            `${item.name} stock is at ${newStock} ${item.unit}. Please restock soon!`
          );
        }
      }
    } catch (e) {
      console.warn("Failed to add log:", e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.usageCard}>
      <View style={styles.usageRow}>
        <Text style={styles.usageItem}>{item.itemName}</Text>
        <Text style={styles.usageAmount}>-{item.amount}</Text>
      </View>
      <Text style={styles.usageDate}>
        {new Date(item.dateISO).toLocaleTimeString()}
      </Text>
      {item.note ? <Text style={styles.usageNote}>{item.note}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Usage</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Image 
        source={require('../../assets/images/DailyUsageCat.png')} 
        style={styles.headerImage}
        resizeMode="contain"
      />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.blueCard]}>
          <Ionicons name="calendar-outline" size={22} color="#fff" />
          <Text style={styles.statValue}>
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.statLabel}>Current Date</Text>
        </View>

        <View style={[styles.statCard, styles.greenCard]}>
          <Ionicons name="cube-outline" size={22} color="#fff" />
          <Text style={styles.statValue}>{availableCount}</Text>
          <Text style={styles.statLabel}>Available Items</Text>
        </View>

        <View style={[styles.statCard, styles.orangeCard]}>
          <Ionicons name="document-text-outline" size={22} color="#fff" />
          <Text style={styles.statValue}>{usageData.length}</Text>
          <Text style={styles.statLabel}>Entries Today</Text>
        </View>
      </View>

      {/* List */}
      <Text style={styles.sectionTitle}>Recent Usage Entries</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : usageData.length === 0 ? (
        <Text style={{ color: "#777" }}>No usage recorded today.</Text>
      ) : (
        <FlatList
          data={usageData}
          renderItem={renderItem}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* Modal */}
      <LogUsageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        inventoryItems={inventoryItems}
        onSubmit={(data) => {
          addUsageLog(data);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e6f0ff", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#0047ab" },
  addButton: { backgroundColor: "#0047ab", borderRadius: 24, padding: 8, elevation: 3, marginRight:20, },
  headerImage: {width: 120 ,height: 120, /*marginTop: 10,*/alignSelf:"flex-end"},

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, marginBottom: 12 },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#cfe2ff",
  },
  blueCard: { backgroundColor: "#a8d0ff" },
  greenCard: { backgroundColor: "#a8d0ff" },
  orangeCard: { backgroundColor: "#a8d0ff" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#0047ab", marginTop: 4, textAlign: "center" },
  statLabel: { fontSize: 12, color: "#0047ab", textAlign: "center", marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#0047ab" },
  usageCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#a1c4ff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  usageRow: { flexDirection: "row", justifyContent: "space-between" },
  usageItem: { fontSize: 16, fontWeight: "600", color: "#0047ab" },
  usageAmount: { fontSize: 16, fontWeight: "600", color: "#0047ab" },
  usageDate: { fontSize: 12, color: "#0047ab", marginTop: 4 },
  usageNote: { fontSize: 13, color: "#0047ab", fontStyle: "italic", marginTop: 4 },
});
