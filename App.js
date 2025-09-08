// App.js
import React from "react";

// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // ✅ Was missing
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Icons
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import your screens
import LoginScreen from "./frontend/screens/LoginScreen";
import SignUpScreen from "./frontend/screens/SignUpScreen";
import DashboardScreen from "./frontend/screens/DashboardScreen";
import InventoryScreen from "./frontend/screens/InventoryScreen";
import DailyUsageScreen from "./frontend/screens/DailyUsageScreen";
import ProfileScreen from "./frontend/screens/ProfileScreen";
import HistoryScreen from "./frontend/screens/HistoryScreen";

// Create navigator instances
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Main app tabs)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide header in bottom tabs
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DailyUsage"
        component={DailyUsageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// App entry point
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Initial login screen */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Sign Up screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Main bottom tabs after login */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* History screen can be accessed via navigation */}
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

