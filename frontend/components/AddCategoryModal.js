import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function AddCategoryModal({ visible, onClose, onSave, existingCategories=[] }) {
  const [categoryName,setCategoryName]=useState("");

  const handleSave=()=>{
    const trimmed=categoryName.trim();
    if(!trimmed) return Alert.alert("Error","Please enter a category name");
    if(existingCategories.includes(trimmed)) return Alert.alert("Error","This category already exists");
    onSave(trimmed); setCategoryName(""); onClose();
  };

  const handleClose=()=>{ setCategoryName(""); onClose(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add New Category</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button,styles.save]} onPress={handleSave}>
              <Text style={styles.saveText}>Add Category</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,styles.cancel]} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"},
  container:{backgroundColor:"#fff",borderRadius:12,padding:20,width:"85%",maxWidth:400,alignItems:"center", borderWidth:2, borderColor:"#000"},
  title:{fontSize:18,fontWeight:"bold",color:"#0a0a0a",marginBottom:20,textAlign:"center"},
  inputContainer:{marginBottom:25,width:"100%"},
  input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:12,fontSize:16,color:"#000",backgroundColor:"#F7F7F7",width:"100%"},
  buttonRow:{flexDirection:"row",justifyContent:"space-between",gap:12,width:"100%"},
  button:{flex:1,paddingVertical:12,borderRadius:8,alignItems:"center"},
  cancel:{backgroundColor:"#555"},
  cancelText:{color:"#fff",fontWeight:"bold"},
  save:{backgroundColor:"#2196F3"},
  saveText:{color:"#fff",fontWeight:"bold"}
});
