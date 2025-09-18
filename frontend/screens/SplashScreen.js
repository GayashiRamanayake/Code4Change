// frontend/screens/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // 1 second fade in
      useNativeDriver: true,
    }).start();

    // Navigate to Login after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/images/splashscreen.png")} // <-- Replace with your image
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0E6FA", // optional background
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",     // fill width
    height: "100%",    // fill height
    resizeMode: "cover", // cover the whole screen without stretching
  },
});


