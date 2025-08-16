import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './screens/DashboardScreen';
import InventoryScreen from './screens/InventoryScreen';
import DailyUsageScreen from './screens/DailyUsageScreen';
import ProfileScreen from './screens/ProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }} />
        <Tab.Screen name="Inventory" component={InventoryScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cube-outline" size={size} color={color} />
          ),
        }} />
        <Tab.Screen name="Daily Usage" component={DailyUsageScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text" size={size} color={color} />
          ),
        }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

