import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import StoryScreen from '../screens/StoryScreen';

const Stack = createStackNavigator();

const StackNavigator = () =>{
    return (
        <Stack.Navigator
           initialRouteName = 'Tela Feed' 
           screenOptions={{headerShow: false}}
        >
          <Stack.Screen name="Tela Feed" component={TabNavigator} />
          <Stack.Screen name="Tela de Histórias" component={StoryScreen} />
          
        </Stack.Navigator>
      );
};

export default StackNavigator;