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

          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#aaa" />
          
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
            {categories.map((cat) => <Picker.Item label={cat} value={cat} key={cat} color="#333"/> )}
          </Picker>

          <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} placeholderTextColor="#aaa" />
          <TextInput placeholder="Threshold" value={threshold} onChangeText={setThreshold} keyboardType="numeric" style={styles.input} placeholderTextColor="#aaa" />

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
  modalContainer: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f4f4fa53" },
  modalContent: { width:"90%", backgroundColor:"#010306ff", padding:20, borderRadius:12 },
  title: { fontSize:18, fontWeight:"bold", marginBottom:12, color:"#EAEAEA" },
  input: { borderWidth:1, borderColor:"#222", borderRadius:6, padding:10, marginVertical:6, color:"#EAEAEA", backgroundColor:"#1A1F29" },
  button: { backgroundColor:"#2196F3", padding:12, borderRadius:6, marginTop:10, alignItems:"center" },
  cancel: { backgroundColor:"#555" },
  buttonText: { color:"#fff", fontWeight:"bold" }
});
