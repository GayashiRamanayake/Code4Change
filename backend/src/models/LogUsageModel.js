import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function LogUsageModal({ visible, onClose, inventoryItems, onSubmit }) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // default to first item when list arrives
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
          <Text style={styles.title}>Add Usage</Text>

          <Text style={styles.label}>Item</Text>
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
            placeholder="e.g. 0.5"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            placeholder="Morning batch"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.dark]} onPress={handleAdd}>
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.gray]} onPress={onClose}>
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
  sheet: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 12, color: "#555", marginTop: 8 },
  pickerWrap: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, overflow: "hidden" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 6 },
  row: { flexDirection: "row", gap: 10, marginTop: 14 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  dark: { backgroundColor: "#333" },
  gray: { backgroundColor: "#999" },
  btnText: { color: "#fff", fontWeight: "700" },
});
