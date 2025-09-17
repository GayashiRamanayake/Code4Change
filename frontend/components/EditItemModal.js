import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function EditItemModal({ visible, onClose, item, onSave, onDelete, categories }) {
  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || categories[0] || "Other");
  const [stock, setStock] = useState(item?.stock?.toString() || "0");
  const [threshold, setThreshold] = useState(item?.threshold?.toString() || "0");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setStock(item.stock.toString());
      setThreshold(item.threshold.toString());
    }
  }, [item]);

  const handleUpdate = () => {
    if (!name) return Alert.alert("Validation", "Name cannot be empty.");
    const updatedItem = { name, category, stock: parseInt(stock), threshold: parseInt(threshold) };
    onSave({ id: item.id, ...updatedItem });
    onClose();
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Item</Text>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
            {categories.map((cat) => <Picker.Item label={cat} value={cat} key={cat} />)}
          </Picker>
          <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Threshold" value={threshold} onChangeText={setThreshold} keyboardType="numeric" style={styles.input} />

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.delete]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
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
  delete: { backgroundColor: "red" },
  cancel: { backgroundColor: "#888" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});


