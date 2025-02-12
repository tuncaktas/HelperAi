import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import "./global.css" 
import { FIREBASE_AUTH } from './firebase-config';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import React from 'react';


const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
    })
  }, [])

  return (
   <NavigationContainer>
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
      {!user ? <>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </> : <>
        <Stack.Screen name="Chat" component={ChatScreen} />
      </>}
    </Stack.Navigator>
   </NavigationContainer>
  );
}
