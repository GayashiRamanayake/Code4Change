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
      navigation.replace("MainTabs");
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative top circle */}
      <View style={styles.topCircle}></View>

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

      {/* Forgot Password 
      <Text style={styles.link}>Forgot Password?</Text>*/}

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

      {/* Decorative bottom circle */}
      <View style={styles.bottomCircle}></View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1F5FE", // light background blue
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
  link: { color: "#0277BD", marginBottom: 20, fontSize: 14 },
  demoBox: {
    backgroundColor: "#B3E5FC",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  demoTitle: { fontWeight: "bold", marginBottom: 5, color: "#01579B" },
  footerText: { fontSize: 14, color: "#555" },
  linkHighlight: { color: "#0277BD", fontWeight: "600" },
});
