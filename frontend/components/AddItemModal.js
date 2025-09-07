import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';


export default function AddItemModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState("");         // Item name
  const [stock, setStock] = useState("");       // Current stock
  const [threshold, setThreshold] = useState(""); // Low stock threshold
  const [category, setCategory] = useState("Coffee"); // Default category

  // Called when user presses Save
  const handleAdd = () => {
    if (!name || !stock || !threshold || !category) return; // Validate input

    // Prepare item object to send to backend
    const item = {
      name,
      stock: parseFloat(stock),       // Convert to number
      threshold: parseFloat(threshold), // Convert to number
      category,
    };

    onAdd(item); // Send item to InventoryScreen -> Firebase

    // Reset form
    setName("");
    setStock("");
    setThreshold("");
    setCategory("Coffee");

    onClose(); // Close modal
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Item</Text>

          {/* Item Name */}
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
          />

          {/* Stock Input */}
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Current Stock"
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />
            <View style={styles.unitBox}>
              <Text style={styles.unitText}>g</Text>
            </View>
          </View>

          {/* Threshold Input */}
          <TextInput
            style={styles.input}
            placeholder="Low Stock Threshold"
            keyboardType="numeric"
            value={threshold}
            onChangeText={setThreshold}
          />

          {/* Category Picker */}
          <View style={styles.pickerContainer}>
            <Text style={{ marginBottom: 5 }}>Category:</Text>
            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
              style={styles.picker}
            >
              <Picker.Item label="Coffee" value="Coffee" />
              <Picker.Item label="Dairy" value="Dairy" />
              <Picker.Item label="Sweeteners" value="Sweeteners" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleAdd}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  unitBox: { width: 50, height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  unitText: { fontWeight: "bold" },
  pickerContainer: { marginBottom: 10 },
  picker: { height: 40 },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 15 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: "center", marginLeft: 10 },
  cancelButton: { backgroundColor: "#888" },
  saveButton: { backgroundColor: "#4CAF50" },
  cancelText: { color: "#fff", fontWeight: "bold" },
  saveText: { color: "#fff", fontWeight: "bold" },
});































/*import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";

export default function AddItemModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("");

  const handleAdd = () => {
    if (!name || !stock || !threshold) return;
    onAdd({ name, stock, threshold, id: Date.now().toString() });
    setName("");
    setStock("");
    setThreshold("");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Item</Text>

          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Current Stock"
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />
            <View style={styles.unitBox}>
              <Text style={styles.unitText}>g</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Low Stock Threshold"
            keyboardType="numeric"
            value={threshold}
            onChangeText={setThreshold}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleAdd}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitBox: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  unitText: { fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  cancelButton: { backgroundColor: "#888" },
  saveButton: { backgroundColor: "#4CAF50" },
  cancelText: { color: "#fff", fontWeight: "bold" },
  saveText: { color: "#fff", fontWeight: "bold" },
});*/
