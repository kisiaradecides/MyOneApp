// src/navigation/AppNavigator.js
import React from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';

// Auth
import RegisterScreen from '../screens/auth/RegisterScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Tabs
import HomeScreen from '../screens/home/HomeScreen';
import TransactScreen from '../screens/tabs/TransactScreen';
import ServicesScreen from '../screens/tabs/ServicesScreen';
import GrowScreen from '../screens/tabs/GrowScreen';

// Stack screens
import StatementsScreen from '../screens/home/StatementsScreen';
import StatsScreen from '../screens/home/StatsScreen';
import MshwariScreen from '../screens/mshwari/MshwariScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import GlobalPayScreen from '../screens/globalpay/GlobalPayScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00a651',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: '#ddd' },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Transact: 'swap-horizontal',
            Services: 'list',
            Grow: 'bar-chart',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transact" component={TransactScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Grow" component={GrowScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { userLoggedIn, isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00a651' }}>
        <StatusBar barStyle="light-content" backgroundColor="#00a651" />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!userLoggedIn ? (
          // Auth flow
          <>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
          </>
        ) : !isAuthenticated ? (
          // Biometric / PIN gate
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Main app
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Statements" component={StatementsScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />
            <Stack.Screen name="Mshwari" component={MshwariScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="GlobalPay" component={GlobalPayScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
