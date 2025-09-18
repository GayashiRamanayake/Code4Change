// frontend/screens/SplashScreen.js
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
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
        source={require("../../assets/images/splashscreen.png")}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="stretch" // stretches image to fit full screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0E6FA",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
