import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // dropdown

export default function LogUsageModal({ visible, onClose, onSubmit, inventoryItems }) {
  const [selectedItem, setSelectedItem] = useState(inventoryItems[0]?.name || "");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (!selectedItem || !amount) return;
    onSubmit({ item: selectedItem, amount: parseFloat(amount) });
    setAmount("");
    setSelectedItem(inventoryItems[0]?.name || "");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log Ingredient Usage</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Ingredient Picker */}
          <Text style={styles.label}>Select Ingredient</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedItem}
              onValueChange={(itemValue) => setSelectedItem(itemValue)}
            >
              {inventoryItems.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.name} />
              ))}
            </Picker>
          </View>

          {/* Amount Input */}
          <Text style={styles.label}>Amount Used</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 100 (ml, g, etc.)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Log Usage Button */}
            <TouchableOpacity
              style={[styles.button, styles.logButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.logButtonText}>Log Usage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 12, fontSize: 14, color: "#555" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  logButton: {
    backgroundColor: "#333",
  },
  logButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});
