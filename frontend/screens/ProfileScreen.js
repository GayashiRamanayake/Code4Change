import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [lowStock, setLowStock] = useState(true);
  const [qualityAlerts, setQualityAlerts] = useState(true);

  const handleLogout = () => {
    navigation.replace("Login"); // go back to Login screen
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* User Info */}
      <View style={styles.userSection}>
        <Ionicons name="person-circle-outline" size={50} color="#64B5F6" />
        <View>
          <Text style={styles.userName}>Café Manager</Text>
          <Text style={styles.userEmail}>manager@nekokopi.com</Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.infoCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="calendar-outline" size={24} color="#333" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.infoTitle}>Neko & Kopi Inventory</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.infoSubtitle}>
              Professional inventory management system designed specifically for café operations
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.settingRow}>
        <Ionicons name="notifications-outline" size={20} color="#333" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>Notifications</Text>
          <Text style={styles.settingSubtitle}>Manage your notification preferences</Text>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.settingRow}>
        <Ionicons name="alert-circle-outline" size={20} color="#333" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>Low Stock Alerts</Text>
          <Text style={styles.settingSubtitle}>Get notified when items are running low</Text>
        </View>
        <Switch value={lowStock} onValueChange={setLowStock} />
      </View>

      <View style={styles.settingRow}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#333" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>Quality Alerts</Text>
          <Text style={styles.settingSubtitle}>Monitor ingredient quality status</Text>
        </View>
        <Switch value={qualityAlerts} onValueChange={setQualityAlerts} />
      </View>

      {/* Support */}
      <Text style={styles.sectionTitle}>Support</Text>

      <TouchableOpacity style={styles.supportRow}>
        <Ionicons name="help-circle-outline" size={20} color="#333" />
        <Text style={styles.supportText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportRow}>
        <Ionicons name="information-circle-outline" size={20} color="#333" />
        <Text style={styles.supportText}>About Neko & Kopi</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Cute Cat Illustration */}
      <View style={styles.catContainer}>
        <Image
  source={require("../../assets/images/catcute.jpg")}
  style={styles.catImage}
  resizeMode="contain"
/>

        <Text style={styles.footerText}>
          {"🐾 Serving smiles, one paw at a time 🐾"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D0E6FA", padding: 16, marginTop: 15, },
  userSection: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 13, color: "#666" },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  infoTitle: { fontSize: 15, fontWeight: "bold" },
  version: { color: "#1E88E5", fontSize: 13 },
  infoSubtitle: { fontSize: 12, color: "#555", marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  settingTextContainer: { flex: 1, marginHorizontal: 10 },
  settingTitle: { fontSize: 14, fontWeight: "600" },
  settingSubtitle: { fontSize: 12, color: "#666" },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  supportText: { marginLeft: 10, fontSize: 14, fontWeight: "500" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  logoutText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
  catContainer: { alignItems: "center", marginTop: 10 },
  catImage: { width: 140, height: 140, marginBottom: 8 },
  footerText: { fontSize: 13, color: "#777", textAlign: "center" },
});
