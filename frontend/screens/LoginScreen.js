// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (email === "manager@nekokopi.com" && password === "password") {
//       navigation.replace("MainTabs");
//     } else {
//       Alert.alert("Login Failed", "Invalid email or password");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Decorative top circle */}
//       <View style={styles.topCircle}></View>

//       {/* Logo */}
//       <View style={styles.logoContainer}>
//         <Text style={styles.logo}>☕</Text>
//       </View>

//       {/* Title */}
//       <Text style={styles.title}>Neko & Kopi</Text>
//       <Text style={styles.subtitle}>Inventory Management</Text>

//       {/* Input Fields */}
//       <TextInput
//         style={styles.input}
//         placeholder="Email address"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       {/* Sign In Button */}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>

//       {/* Sign Up Link */}
//       <Text style={styles.footerText}>
//         Don’t have an account?{" "}
//         <Text
//           style={styles.linkHighlight}
//           onPress={() => navigation.navigate("SignUp")}
//         >
//           Sign Up
//         </Text>
//       </Text>

//       {/* Decorative bottom circle */}
//       <View style={styles.bottomCircle}></View>
//     </View>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E1F5FE", // light background blue
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     position: "relative",
//   },
//   topCircle: {
//     position: "absolute",
//     top: -100,
//     right: -100,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: "#29B6F6",
//     opacity: 0.4,
//   },
//   bottomCircle: {
//     position: "absolute",
//     bottom: -100,
//     left: -100,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: "#0288D1",
//     opacity: 0.4,
//   },
//   logoContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "#03A9F4",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   logo: { fontSize: 50, color: "#fff" },
//   title: { fontSize: 28, fontWeight: "bold", color: "#01579B" },
//   subtitle: { fontSize: 16, color: "#0277BD", marginBottom: 20 },
//   input: {
//     width: "100%",
//     height: 50,
//     borderWidth: 0,
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 3,
//     color: "#000",
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#0288D1",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
//   link: { color: "#0277BD", marginBottom: 20, fontSize: 14 },
//   demoBox: {
//     backgroundColor: "#B3E5FC",
//     padding: 15,
//     borderRadius: 12,
//     width: "100%",
//     marginBottom: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   demoTitle: { fontWeight: "bold", marginBottom: 5, color: "#01579B" },
//   footerText: { fontSize: 14, color: "#555" },
//   linkHighlight: { color: "#0277BD", fontWeight: "600" },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  // Preload demo user if not exists
  useEffect(() => {
    const loadUsers = async () => {
      const jsonValue = await AsyncStorage.getItem("@users");
      let storedUsers = jsonValue ? JSON.parse(jsonValue) : [];

      // Add demo user
      if (!storedUsers.find((u) => u.email === "manager@nekokopi.com")) {
        storedUsers.push({ name: "Admin", email: "manager@nekokopi.com", password: "password" });
        await AsyncStorage.setItem("@users", JSON.stringify(storedUsers));
      }

      setUsers(storedUsers);
    };

    loadUsers();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    const jsonValue = await AsyncStorage.getItem("@users");
    const storedUsers = jsonValue ? JSON.parse(jsonValue) : [];

    const user = storedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      Alert.alert("Success", `Welcome back, ${user.name}!`);
      navigation.replace("MainTabs");
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCircle}></View>
      <View style={styles.bottomCircle}></View>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>☕</Text>
      </View>

      <Text style={styles.title}>Neko & Kopi</Text>
      <Text style={styles.subtitle}>Inventory Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text
          style={styles.linkHighlight}
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1F5FE",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative",
  },
  topCircle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#29B6F6",
    opacity: 0.4,
  },
  bottomCircle: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#0288D1",
    opacity: 0.4,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#03A9F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  logo: { fontSize: 50, color: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "#01579B" },
  subtitle: { fontSize: 16, color: "#0277BD", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#0288D1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  footerText: { fontSize: 14, color: "#555" },
  linkHighlight: { color: "#0277BD", fontWeight: "600" },
});
