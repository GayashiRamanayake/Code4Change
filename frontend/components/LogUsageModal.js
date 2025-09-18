import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function LogUsageModal({ visible, onClose, inventoryItems, onSubmit }) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const sortedItems = inventoryItems.slice().sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  useEffect(() => {
    if (!visible) return;
    setSelectedItemId(prev => {
      if (sortedItems.some(i => i.id === prev)) {
        return prev;
      }
      return sortedItems[0]?.id || "";
    });
  }, [visible, sortedItems]);

  const handleSubmit = () => {
    if (!selectedItemId || !amount) return;
    const item = inventoryItems.find(i => i.id === selectedItemId);
    if (!item) return;

    onSubmit({ itemId: selectedItemId, itemName: item.name, amount, note });

    setAmount("");
    setNote("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Usage</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedItemId}
              onValueChange={setSelectedItemId}
            >
              {sortedItems.map(i => (
                <Picker.Item key={i.id} label={i.name} value={i.id} />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Amount"
            placeholderTextColor="#a9a9a9"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Note"
            placeholderTextColor="#a9a9a9"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#1E88E5' }]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#696969ff' }]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width:'90%',
    padding:20,
    backgroundColor:'#fff',
    borderRadius:10
  },
  title: {
    fontSize:18,
    fontWeight:'bold',
    marginBottom:10,
    textAlign:"center"
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
    overflow: 'hidden'
  },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:5,
    padding:8,
    marginVertical:5
  },
  buttonRow: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10
  },
  button: {
    padding:10,
    borderRadius:5,
    flex:1,
    marginHorizontal:5
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold'
  }
});
