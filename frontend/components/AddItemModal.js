import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function AddItemModal({ visible, onClose, onSave, categories }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0] || "Other");
  const [stock, setStock] = useState("0");
  const [threshold, setThreshold] = useState("0");

  useEffect(() => {
    if (categories.length > 0) setCategory(categories[0]);
  }, [categories]);

  const handleAdd = () => {
    if (!name) return Alert.alert("Validation", "Name cannot be empty.");
    onSave({ name, category, stock: parseInt(stock), threshold: parseInt(threshold) });
    setName("");
    setCategory(categories[0] || "Other");
    setStock("0");
    setThreshold("0");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Item</Text>

          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />

          <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
            {categories.map((cat) => <Picker.Item label={cat} value={cat} key={cat} />)}
          </Picker>

          <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Threshold" value={threshold} onChangeText={setThreshold} keyboardType="numeric" style={styles.input} />

          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000066" },
  modalContent: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginVertical: 6 },
  button: { backgroundColor: "#333", padding: 12, borderRadius: 6, marginTop: 10, alignItems: "center" },
  cancel: { backgroundColor: "#888" },
  buttonText: { color: "#fff", fontWeight: "bold" },
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
