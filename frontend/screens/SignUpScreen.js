// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const SignUpScreen = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const jsonValue = await AsyncStorage.getItem("@users");
//       setUsers(jsonValue ? JSON.parse(jsonValue) : []);
//     };
//     fetchUsers();
//   }, []);

//   const saveUsers = async (newUsers) => {
//     await AsyncStorage.setItem("@users", JSON.stringify(newUsers));
//     setUsers(newUsers);
//   };

//   const handleSignUp = async () => {
//     // Validation
//     if (!name.trim() || !email.trim() || !password || !confirmPassword) {
//       Alert.alert("Error", "All fields are required");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
//     if (exists) {
//       Alert.alert("Error", "User already exists");
//       return;
//     }

//     const newUsers = [...users, { name, email, password }];
//     await saveUsers(newUsers);

//     Alert.alert("Success", "Account created! You can now login.");
//     navigation.replace("Login");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topCircle}></View>
//       <View style={styles.bottomCircle}></View>

//       <View style={styles.logoContainer}>
//         <Text style={styles.logo}>☕</Text>
//       </View>

//       <Text style={styles.title}>Neko & Kopi</Text>
//       <Text style={styles.subtitle}>Inventory Management</Text>

//       <View style={styles.formBox}>
//         <Text style={styles.formTitle}>Create Account</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//         />

//         <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//           <Text style={styles.buttonText}>Create Account</Text>
//         </TouchableOpacity>

//         <Text style={styles.footerText}>
//           Already have an account?{" "}
//           <Text
//             style={styles.linkHighlight}
//             onPress={() => navigation.navigate("Login")}
//           >
//             Sign In
//           </Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default SignUpScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E1F5FE",
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
//   formBox: {
//     width: "100%",
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   formTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#01579B" },
//   input: {
//     width: "100%",
//     height: 50,
//     borderWidth: 0,
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: "#F1F9FF",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 2,
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
//   footerText: { textAlign: "center", marginTop: 10, color: "#555" },
//   linkHighlight: { color: "#0277BD", fontWeight: "600" },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const jsonValue = await AsyncStorage.getItem("@users");
      setUsers(jsonValue ? JSON.parse(jsonValue) : []);
    };
    fetchUsers();
  }, []);

  const saveUsers = async (newUsers) => {
    await AsyncStorage.setItem("@users", JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      setError("User already exists");
      return;
    }

    const newUsers = [...users, { name, email, password }];
    await saveUsers(newUsers);

    setSuccess("Account created! You can now log in.");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    // Auto navigate after 2 seconds
    setTimeout(() => {
      navigation.replace("Login");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCircle}></View>
      <View style={styles.bottomCircle}></View>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>☕</Text>
      </View>

      <Text style={styles.title}>Neko & Kopi</Text>
      <Text style={styles.subtitle}>Inventory</Text>

      <View style={styles.formBox}>
        <Text style={styles.formTitle}>Create Account</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.linkHighlight}
            onPress={() => navigation.navigate("Login")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
  formBox: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#01579B",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F1F9FF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
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
  footerText: { textAlign: "center", marginTop: 10, color: "#555" },
  linkHighlight: { color: "#0277BD", fontWeight: "600" },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
