// HistoryScreen.js
// React Native screen for Inventory History (JavaScript)
// Compatible with Firebase-backed Node/Express API via a service layer.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // yarn add @react-native-picker/picker
// Optional icons: yarn add react-native-vector-icons
import Feather from "react-native-vector-icons/Feather";

// ====== CONFIG ======
const API_BASE_URL = "https://YOUR-BACKEND-BASE-URL"; // <-- change this

// ====== SERVICE LAYER (Frontend) ======
// If you already have services/historyService.js, replace calls below with your import.
// Example backend route: routes.js -> router.get('/inventory/history', controller.listHistory)
const historyService = {
  async listHistory(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        params.append(k, String(v).trim());
      }
    });
    const url = `${API_BASE_URL}/inventory/history?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(msg || "Failed to fetch inventory history");
    }
    return res.json(); // expected: array of records
  },
};

// ====== STATIC FILTER DATA ======
const CATEGORIES = ["All", "Coffee", "Dairy", "Sweetener", "Supplies", "Pastry", "Flavoring"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const MONTHS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];
const YEARS = ["2025", "2024", "2023", "2022", "2021"];
const WEEKS = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

// ====== UI HELPERS ======
const categoryPillStyle = (category) => {
  switch (category) {
    case "Coffee":
      return [styles.pill, { backgroundColor: "#5A3E36" }, styles.pillTextLight];
    case "Dairy":
      return [styles.pill, { backgroundColor: "#EADBC8" }, styles.pillTextDark];
    case "Sweetener":
      return [styles.pill, { backgroundColor: "#EEE5FF" }, styles.pillTextDark];
    case "Supplies":
      return [styles.pill, { backgroundColor: "#F1F5F9" }, styles.pillTextDark];
    case "Pastry":
      return [styles.pill, { backgroundColor: "#AD7A56" }, styles.pillTextLight];
    case "Flavoring":
      return [styles.pill, { backgroundColor: "#E7E5E4" }, styles.pillTextDark];
    default:
      return [styles.pill, { backgroundColor: "#E5E7EB" }, styles.pillTextDark];
  }
};

// ====== MAIN SCREEN ======
export default function HistoryScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");

  const [data, setData] = useState([]); // server data
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const debouncedSearch = useDebounce(search, 350);

  // Build filters for backend
  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      category: category === "All" ? "" : category,
      date: day, // numeric day
      month, // 1..12
      year, // yyyy
      week, // "Week N"
    }),
    [debouncedSearch, category, day, month, year, week]
  );

  useEffect(() => {
    let isActive = true;
    const run = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await historyService.listHistory(filters);
        if (!isActive) return;
        setData(Array.isArray(res) ? res : []);
      } catch (e) {
        if (!isActive) return;
        setErr(e.message || "Failed to load history");
      } finally {
        if (isActive) setLoading(false);
      }
    };
    run();
    return () => {
      isActive = false;
    };
  }, [filters]);

  // Totals (use server totals if your API provides them)
  const totals = useMemo(() => {
    const totalItems = data.length;
    const totalStock = data.reduce((s, r) => s + (Number(r.stock) || 0), 0);
    const totalValue = data.reduce((s, r) => s + (Number(r.value) || 0), 0);
    return { totalItems, totalStock, totalValue };
  }, [data]);

  const renderItem = ({ item, index }) => {
    const rowBg = index % 2 === 0 ? styles.rowBgA : styles.rowBgB;
    return (
      <View style={[styles.row, rowBg]}>
        <View style={styles.itemCol}>
          <Text style={styles.itemTitle}>{item.item}</Text>
          <Text style={styles.itemSub}>{item.date}</Text>
        </View>
        <View style={styles.categoryCol}>
          <View style={categoryPillStyle(item.category)[0]}>
            <Text style={categoryPillStyle(item.category)[2]}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.numCol}>
          <Text style={styles.numText}>{item.stock}</Text>
        </View>
        <View style={styles.numCol}>
          <Text style={styles.usageText}>-{item.usage}</Text>
        </View>
        <View style={styles.valueCol}>
          <Text style={styles.valueText}>${Number(item.value || 0).toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <CircleButton onPress={() => navigation?.goBack?.()}>
              <Feather name="arrow-left" size={18} />
            </CircleButton>
            <CircleButton onPress={() => navigation?.navigate?.("Home")}>
              <Feather name="home" size={18} />
            </CircleButton>
          </View>
          <Text style={styles.headerTitle}>Inventory History</Text>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => {
              // If you implement mobile export later, call your /inventory/history/export
              // For now just no-op to keep UX consistent.
            }}
          >
            <Feather name="download" size={16} color="#fff" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.card}>
          <View style={styles.searchWrap}>
            <Feather name="search" size={16} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search items or categories..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="filter" size={18} color="#AD7A56" />
            <Text style={styles.cardHeaderTitle}>Filters</Text>
          </View>

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={category}
              onValueChange={(v) => setCategory(v)}
              dropdownIconColor="#AD7A56"
            >
              {CATEGORIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {/* Time filters grid */}
          <View style={styles.grid}>
            {/* Day */}
            <View style={styles.gridCell}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={day} onValueChange={setDay}>
                  <Picker.Item label="Day" value="" />
                  {DAYS.map((d) => (
                    <Picker.Item key={d} label={d} value={d} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Month */}
            <View style={styles.gridCell}>
              <Text style={styles.label}>Month</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={month} onValueChange={setMonth}>
                  <Picker.Item label="Month" value="" />
                  {MONTHS.map((m) => (
                    <Picker.Item key={m.value} label={m.label} value={m.value} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Year */}
            <View style={styles.gridCell}>
              <Text style={styles.label}>Year</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={year} onValueChange={setYear}>
                  <Picker.Item label="Year" value="" />
                  {YEARS.map((y) => (
                    <Picker.Item key={y} label={y} value={y} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Week */}
            <View style={styles.gridCell}>
              <Text style={styles.label}>Week</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={week} onValueChange={setWeek}>
                  <Picker.Item label="Week" value="" />
                  {WEEKS.map((w) => (
                    <Picker.Item key={w} label={w} value={w} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.card}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Item</Text>
            <Text style={[styles.th, { flex: 1 }]}>Category</Text>
            <Text style={[styles.th, { flex: 0.8 }]}>Stock</Text>
            <Text style={[styles.th, { flex: 0.8 }]}>Usage</Text>
            <Text style={[styles.th, { flex: 1 }]}>Value</Text>
          </View>

          {/* Loading / Error / List */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator />
              <Text style={styles.muted}>Loading…</Text>
            </View>
          ) : err ? (
            <View style={styles.center}>
              <Feather name="alert-triangle" size={18} color="#DC2626" />
              <Text style={[styles.muted, { color: "#DC2626", marginTop: 6 }]}>{err}</Text>
            </View>
          ) : data.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.muted}>No records found.</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>

        {/* Summary Footer */}
        <View style={styles.summary}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryNumber}>{totals.totalItems}</Text>
            <Text style={styles.summaryLabel}>Total Items</Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryNumber}>{totals.totalStock}</Text>
            <Text style={styles.summaryLabel}>Total Stock</Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryNumber}>
              ${Number(totals.totalValue || 0).toFixed(2)}
            </Text>
            <Text style={styles.summaryLabel}>Total Value</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ====== SMALL COMPONENTS ======
function CircleButton({ children, onPress }) {
  return (
    <TouchableOpacity style={styles.circleBtn} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

// ====== HOOKS ======
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  const t = useRef();
  useEffect(() => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t.current);
  }, [value, delay]);
  return v;
}

// ====== STYLES ======
const colors = {
  bg: "#F8F7F4",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#0F172A",
  muted: "#6B7280",
  coffeeLight: "#EADBC8",
  coffeeMedium: "#AD7A56",
  coffeeDark: "#5A3E36",
  cream: "#F7EFE7",
  accentRow: "rgba(173, 122, 86, 0.06)",
  accentRowAlt: "rgba(250, 250, 250, 1)",
  destructive: "#DC2626",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.coffeeDark,
    gap: 6,
  },
  exportText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: colors.card,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  cardHeaderTitle: { fontSize: 16, fontWeight: "700", color: colors.text },

  searchWrap: { position: "relative", justifyContent: "center" },
  searchIcon: { position: "absolute", left: 10, zIndex: 1 },
  searchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.coffeeLight,
    paddingLeft: 32,
    paddingRight: 12,
    borderRadius: 8,
    color: colors.text,
    backgroundColor: "#fff",
  },

  label: { fontSize: 12, color: colors.text, marginBottom: 6, fontWeight: "600" },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.coffeeLight,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", columnGap: 12 },
  gridCell: { flexBasis: "48%", marginBottom: 6 },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  th: { fontSize: 12, fontWeight: "700", color: colors.text },

  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowBgA: { backgroundColor: colors.accentRowAlt },
  rowBgB: { backgroundColor: colors.accentRow },

  itemCol: { flex: 2 },
  categoryCol: { flex: 1, alignItems: "flex-start", justifyContent: "center" },
  numCol: { flex: 0.8, alignItems: "flex-start", justifyContent: "center" },
  valueCol: { flex: 1, alignItems: "flex-start", justifyContent: "center" },

  itemTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  itemSub: { fontSize: 12, color: colors.muted, marginTop: 2 },

  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillTextLight: { color: "#fff", fontSize: 12, fontWeight: "600" },
  pillTextDark: { color: "#111827", fontSize: 12, fontWeight: "600" },

  numText: { fontSize: 14, fontWeight: "600", color: colors.text },
  usageText: { fontSize: 14, fontWeight: "700", color: colors.destructive },
  valueText: { fontSize: 14, fontWeight: "700", color: colors.coffeeDark },

  separator: { height: 1, backgroundColor: colors.border },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  muted: { color: colors.muted },

  summary: {
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: colors.coffeeDark,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryCell: { alignItems: "center" },
  summaryNumber: { color: "#fff", fontSize: 20, fontWeight: "800" },
  summaryLabel: { color: "#fff", opacity: 0.9, marginTop: 4, fontSize: 12 },
});
