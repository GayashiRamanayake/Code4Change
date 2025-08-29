import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Modal, Button } from "react-native";

export default function AddItemModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAdd = () => {
    if (name && category && quantity) {
      onAdd({ name, category, quantity, id: Date.now().toString() });
      setName("");
      setCategory("");
      setQuantity("");
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Item</Text>

          <TextInput
            placeholder="Item Name"
            style={styles.modalInput}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Category"
            style={styles.modalInput}
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            placeholder="Quantity"
            style={styles.modalInput}
            value={quantity}
            onChangeText={setQuantity}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button title="Cancel" onPress={onClose} />
            <View style={{ width: 10 }} />
            <Button title="Add" onPress={handleAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
});
