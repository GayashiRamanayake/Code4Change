// import React, { useState } from "react";
// import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker"; // dropdown

// export default function LogUsageModal({ visible, onClose, onSubmit, inventoryItems }) {
//   const [selectedItem, setSelectedItem] = useState(inventoryItems[0]?.name || "");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = () => {
//     if (!selectedItem || !amount) return;
//     onSubmit({ item: selectedItem, amount: parseFloat(amount) });
//     setAmount("");
//     setSelectedItem(inventoryItems[0]?.name || "");
//     onClose();
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Log Ingredient Usage</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="#333" />
//             </TouchableOpacity>
//           </View>

//           {/* Ingredient Picker */}
//           <Text style={styles.label}>Select Ingredient</Text>
//           <View style={styles.pickerWrapper}>
//             <Picker
//               selectedValue={selectedItem}
//               onValueChange={(itemValue) => setSelectedItem(itemValue)}
//             >
//               {inventoryItems.map((item) => (
//                 <Picker.Item key={item.id} label={item.name} value={item.name} />
//               ))}
//             </Picker>
//           </View>

//           {/* Amount Input */}
//           <Text style={styles.label}>Amount Used</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. 100 (ml, g, etc.)"
//             keyboardType="numeric"
//             value={amount}
//             onChangeText={setAmount}
//           />

//           {/* Buttons Row */}
//           <View style={styles.buttonRow}>
//             {/* Cancel Button */}
//             <TouchableOpacity
//               style={[styles.button, styles.cancelButton]}
//               onPress={onClose}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>

//             {/* Log Usage Button */}
//             <TouchableOpacity
//               style={[styles.button, styles.logButton]}
//               onPress={handleSubmit}
//             >
//               <Text style={styles.logButtonText}>Log Usage</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "85%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     elevation: 5,
//   },
//   header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   title: { fontSize: 18, fontWeight: "bold" },
//   label: { marginTop: 12, fontSize: 14, color: "#555" },
//   pickerWrapper: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 4,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   logButton: {
//     backgroundColor: "#333",
//   },
//   logButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   cancelButton: {
//     backgroundColor: "#ccc",
//   },
//   cancelButtonText: {
//     color: "#333",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function LogUsageModal({ visible, onClose, inventoryItems, onSubmit }) {
  const [selectedItemId, setSelectedItemId] = useState(inventoryItems[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!selectedItemId || !amount) return;
    const item = inventoryItems.find(i => i.id === selectedItemId);
    onSubmit({ itemId: selectedItemId, itemName: item.name, amount, note });
    setAmount(""); setNote(""); setSelectedItemId(inventoryItems[0]?.id || "");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Usage</Text>
          <Picker selectedValue={selectedItemId} onValueChange={setSelectedItemId}>
            {inventoryItems.map(i => <Picker.Item key={i.id} label={i.name} value={i.id} />)}
          </Picker>
          <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} style={styles.input} keyboardType="numeric"/>
          <TextInput placeholder="Note" value={note} onChangeText={setNote} style={styles.input}/>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.buttonText}>Add</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor:'#aaa'}]} onPress={onClose}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'},
  modalContent:{width:'90%',padding:20,backgroundColor:'#fff',borderRadius:10},
  title:{fontSize:18,fontWeight:'bold',marginBottom:10},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:5,padding:8,marginVertical:5},
  buttonRow:{flexDirection:'row',justifyContent:'space-between',marginTop:10},
  button:{backgroundColor:'#333',padding:10,borderRadius:5,flex:1,marginHorizontal:5},
  buttonText:{color:'#fff',textAlign:'center',fontWeight:'bold'}
});
