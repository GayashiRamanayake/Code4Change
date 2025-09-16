import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function LogUsageModal({ visible, onClose, inventoryItems, onSubmit }) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (inventoryItems?.length && !selectedItemId) {
      setSelectedItemId(inventoryItems[0].id);
    }
  }, [inventoryItems]);

  const handleAdd = () => {
    const item = inventoryItems.find((i) => i.id === selectedItemId);
    if (!item || !amount.trim()) return;
    onSubmit({
      itemId: item.id,
      itemName: item.name,
      amount: amount.trim(),
      note,
    });
    setAmount("");
    setNote("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>➕ Add Usage</Text>

          <Text style={styles.label}>Select Item</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={selectedItemId}
              onValueChange={(v) => setSelectedItemId(v)}
            >
              {inventoryItems.map((i) => (
                <Picker.Item key={i.id} label={i.name} value={i.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            placeholder="e.g. Morning batch"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={handleAdd}>
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#007BFF", marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", marginTop: 8 },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: "center", marginHorizontal: 5 },
  confirm: { backgroundColor: "#007BFF" },
  cancel: { backgroundColor: "#aaa" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
