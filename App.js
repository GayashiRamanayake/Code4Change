import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Import your screens
import LoginScreen from "./frontend/screens/LoginScreen";
import SignUpScreen from "./frontend/screens/SignUpScreen";   // ✅ add this
import DashboardScreen from "./frontend/screens/DashboardScreen";
import InventoryScreen from "./frontend/screens/InventoryScreen";
import DailyUsageScreen from "./frontend/screens/DailyUsageScreen";
import ProfileScreen from "./frontend/screens/ProfileScreen";
import HistoryScreen from "./frontend/screens/HistoryScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Main App Tabs)
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cube-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Daily Usage"
        component={DailyUsageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-text"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account"
              size={size}
              color={color}
            />
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
        {/* First screen when app starts */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Sign Up screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* After login, show bottom tabs */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        
        <Stack.Screen name="History" component={HistoryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
