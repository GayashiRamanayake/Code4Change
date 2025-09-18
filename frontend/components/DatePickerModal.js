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
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
              <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
            </TouchableOpacity>
          )}
          {showPicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={handleChange} />
          )}

          {/* Action Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={() => onViewHistory(date)}>
              <Text style={styles.viewButtonText}>View History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", alignItems:"center" },
  modalContainer: { backgroundColor:"#fff", padding:24, borderRadius:12, width:"80%", alignItems:"center", borderWidth:2, borderColor:"#000" },
  title: { fontSize:16, fontWeight:"bold", marginBottom:10, textAlign:"center", color:"#0a0a0a" },
  buttons: { flexDirection:"row", justifyContent:"space-between", marginTop:20, width:"100%", gap:12 },
  button: { flex:1, paddingVertical:12, borderRadius:8, alignItems:"center", borderWidth:1, borderColor:"#1976D2" },
  cancelButton: { backgroundColor:"#555", borderWidth:0 },
  cancelButtonText: { color:"#fff", fontWeight:"bold", textAlign:"center" },
  viewButton: { backgroundColor:"#1976D2", borderWidth:0 },
  viewButtonText: { color:"#fff", fontWeight:"bold", textAlign:"center" },
  dateButton: { padding:10, borderWidth:1, borderColor:"#1976D2", borderRadius:8, marginBottom:10, width:"100%", alignItems:"center" },
  dateButtonText: { color:"#1976D2", fontWeight:"bold", textAlign:"center" }
});
