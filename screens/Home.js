import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CoursesAvailable from './CoursesAvailable';
import Dashboard from './CoursesEnrolled';
import JoinClass from './JoinClass';
import CreateClass from './CreateClass';
import Logout from './logout';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#3C0A6B' },
      headerTintColor: 'white',
      tabBarActiveTintColor: 'white',
      tabBarActiveBackgroundColor: '#3C0A6B',
    }}
  >
    <Tab.Screen
      name="Courses Enrolled"
      component={Dashboard}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Courses Available"
      component={CoursesAvailable}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="reader-outline" color={color} size={size} />,
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#3C0A6B' },
      headerTintColor: 'white',
      drawerActiveTintColor: 'white',
      drawerInactiveTintColor: 'black',
      drawerActiveBackgroundColor: '#3C0A6B',
      drawerStyle: { backgroundColor: '#D4BEE4', width: 300 },
      drawerHideStatusBarOnOpen: true,
      drawerLabelStyle: { fontSize: 15 },
    }}
  >
    <Drawer.Screen
      name="Dashboard"
      component={TabNavigator}
      options={{
        drawerIcon: ({ color }) => <Ionicons name="home" size={25} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Create Class"
      component={CreateClass}
      options={{
        drawerIcon: ({ color }) => <Ionicons name="add-outline" size={25} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Join Class"
      component={JoinClass}
      options={{
        drawerIcon: ({ color }) => <Ionicons name="return-down-forward-outline" size={25} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Logout"
      component={Logout}
      options={{
        drawerIcon: ({ color }) => <Ionicons name="log-out-outline" size={25} color={color} />,
      }}
    />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
