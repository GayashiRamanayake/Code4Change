import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerModal({ visible, onClose, onViewHistory }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleViewHistory = () => { onViewHistory(selectedDate); onClose(); };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Date</Text>

          <TouchableOpacity style={styles.dateButton} onPress={()=>setShowPicker(true)}>
            <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={(event, date) => { setShowPicker(false); if(date)setSelectedDate(date); }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={handleViewHistory}>
              <Text style={styles.viewText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles=StyleSheet.create({
  overlay:{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"},
  modalContainer:{width:"85%",backgroundColor:"#0D1117",borderRadius:12,padding:20,elevation:5},
  modalTitle:{fontSize:18,fontWeight:"bold",textAlign:"center",marginBottom:15,color:"#EAEAEA"},
  dateButton:{borderWidth:1,borderColor:"#222",borderRadius:8,padding:12,marginBottom:20,alignItems:"center"},
  dateText:{fontSize:16,color:"#EAEAEA"},
  buttonRow:{flexDirection:"row",justifyContent:"space-between"},
  button:{flex:1,paddingVertical:12,borderRadius:8,alignItems:"center",marginHorizontal:5},
  cancelButton:{backgroundColor:"#555"},
  viewButton:{backgroundColor:"#2196F3"},
  cancelText:{color:"#EAEAEA",fontWeight:"600"},
  viewText:{color:"#fff",fontWeight:"600"}
});

