// components/DatePickerModal.js
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerModal({ visible, onClose, onViewHistory }) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  const handleChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS === "android") setShowPicker(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Date</Text>

          {/* Date Picker */}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
            </TouchableOpacity>
          )}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.viewButton]}
              onPress={() => onViewHistory(date)}
            >
              <Text style={{ color: "#fff" }}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#00000055", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "80%", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  buttons: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, width: "100%" },
  button: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#1976D2", width: 100, alignItems: "center" },
  viewButton: { backgroundColor: "#1976D2", borderWidth: 0 },
  dateButton: { padding: 10, borderWidth: 1, borderColor: "#1976D2", borderRadius: 8, marginBottom: 10 },
  dateButtonText: { color: "#1976D2", fontWeight: "bold" },
});
