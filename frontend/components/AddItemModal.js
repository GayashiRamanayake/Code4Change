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
    setName(""); setCategory(categories[0] || "Other"); setStock("0"); setThreshold("0");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Item</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <View style={styles.pickerContainer}>
            <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
              {categories.map((cat) => (
                <Picker.Item label={cat} value={cat} key={cat} color="#333" />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Stock"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Threshold"
            value={threshold}
            onChangeText={setThreshold}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.flexButton]} onPress={handleAdd}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancel, styles.flexButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4fa53" },
  modalContent: { width: "90%", backgroundColor: "#ffffffff", padding: 20, borderRadius: 12, borderWidth: 2, borderColor: "#2196F3" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#000000ff", textAlign:"center" },
  input: { borderWidth: 1, borderColor: "#222", borderRadius: 6, padding: 10, marginVertical: 6, color: "#1A1A1A", backgroundColor: "#f0f0f0" },
  pickerContainer: { borderWidth: 2, borderColor: "#6e6e6eff", borderRadius: 6, marginVertical: 6, backgroundColor: "#f0f0f0" },
  picker: { height: 50, width: "100%" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: { backgroundColor: "#2196F3", padding: 12, borderRadius: 6, alignItems: "center" },
  flexButton: { flex: 1, marginHorizontal: 5 },
  cancel: { backgroundColor: "#808080" },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
