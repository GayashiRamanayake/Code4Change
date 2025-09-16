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
//       navigation.replace("MainTabs"); // go to dashboard after login
//     } else {
//       Alert.alert("Login Failed", "Invalid email or password");
//     }
//   };

//   return (
//     <View style={styles.container}>
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

//       {/* Button */}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>

//       {/* Forgot Password */}
//       <Text style={styles.link}>Forgot Password?</Text>

//       {/* Demo Credentials */}
//       <View style={styles.demoBox}>
//         <Text style={styles.demoTitle}>Demo Credentials</Text>
//         <Text>Email: manager@nekokopi.com</Text>
//         <Text>Password: password</Text>
//       </View>

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
//     </View>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   logoContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#E0F7FA",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   logo: { fontSize: 40 },
//   title: { fontSize: 24, fontWeight: "bold" },
//   subtitle: { fontSize: 16, color: "#007AFF", marginBottom: 20 },
//   input: {
//     width: "100%",
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#29B6F6",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
//   link: { color: "#007AFF", marginBottom: 20 },
//   demoBox: {
//     backgroundColor: "#E8F5E9",
//     padding: 15,
//     borderRadius: 8,
//     width: "100%",
//     marginBottom: 20,
//   },
//   demoTitle: { fontWeight: "bold", marginBottom: 5 },
//   footerText: { fontSize: 14 },
//   linkHighlight: { color: "#007AFF", fontWeight: "600" },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "manager@nekokopi.com" && password === "password") {
      navigation.replace("MainTabs"); // go to dashboard after login
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>☕</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Neko & Kopi</Text>
      <Text style={styles.subtitle}>Inventory Management</Text>

      {/* Input Fields */}
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

      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <Text style={styles.link}>Forgot Password?</Text>

      {/* Demo Credentials */}
      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Demo Credentials</Text>
        <Text>Email: manager@nekokopi.com</Text>
        <Text>Password: password</Text>
      </View>

      {/* Sign Up Link */}
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E0F7FA", // light blue background
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#29B6F6", // darker blue circle
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: { fontSize: 50, color: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "#007AFF" },
  subtitle: { fontSize: 16, color: "#007AFF", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#29B6F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { color: "#007AFF", marginBottom: 20, fontSize: 14 },
  demoBox: {
    backgroundColor: "#B3E5FC",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  demoTitle: { fontWeight: "bold", marginBottom: 5, color: "#01579B" },
  footerText: { fontSize: 14, color: "#555" },
  linkHighlight: { color: "#007AFF", fontWeight: "600" },
});
