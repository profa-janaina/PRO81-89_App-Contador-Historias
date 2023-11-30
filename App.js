// Aula 87
// Objetivos:  Criar o tema claro.
//             Integrar os temas no aplicativo para que os usuários possam escolher entre os dois temas

import *as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

//import * as firebase from 'firebase';
import { db } from './config';

// import { initializeApp } from "firebase/app";

//  if (!app.length) {
//   const app = initializeApp(firebaseConfig);
// // } else {
// //   firebase.app();
//  }

const Stack = createStackNavigator();

const StackNav = () =>{
    return (
        <Stack.Navigator
           initialRouteName = 'Login' 
           screenOptions={{
            headerShow: false,
            gestureEnabled: false}}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DrawerNavigator} />          
        </Stack.Navigator>
      );
};

export default function App() {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}


