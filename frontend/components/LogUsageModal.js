import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function LogUsageModal({ visible, onClose, inventoryItems, onSubmit }) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Sort inventory items alphabetically by name
  const sortedItems = inventoryItems.slice().sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // When modal opens, keep previous selection or default to first item
  useEffect(() => {
    if (!visible) return; // only run when modal opens
    setSelectedItemId(prev => {
      if (sortedItems.some(i => i.id === prev)) {
        return prev; // keep previous selection if it still exists
      }
      return sortedItems[0]?.id || ""; // otherwise select first item
    });
  }, [visible, sortedItems]);

  const handleSubmit = () => {
    if (!selectedItemId || !amount) return;
    const item = inventoryItems.find(i => i.id === selectedItemId);
    if (!item) return;

    onSubmit({ itemId: selectedItemId, itemName: item.name, amount, note });

    // Reset amount and note only, keep selected item
    setAmount("");
    setNote("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Usage</Text>

          <Picker
            selectedValue={selectedItemId}
            onValueChange={setSelectedItemId}
          >
            {sortedItems.map(i => (
              <Picker.Item key={i.id} label={i.name} value={i.id} />
            ))}
          </Picker>

          <TextInput
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Note"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#aaa' }]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
