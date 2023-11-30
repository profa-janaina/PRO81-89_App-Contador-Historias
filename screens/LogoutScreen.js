import {React, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Platform, Alert,ToastAndroid } from "react-native";

import { useNavigation } from '@react-navigation/native';

import {auth} from "../config";
import { signOut } from 'firebase/auth';

export default function LogoutScreen() {
    const navigation = useNavigation();
 
  useEffect(() =>{ 
    signOut(auth).then(() => {
      if( Platform.OS === "android"){
        ToastAndroid.show("Você saiu do app", ToastAndroid.LONG);
      }else{
        Alert.alert("Você saiu do app");
      }
      navigation.replace("Login");
    }).catch((error) => {
      if( Platform.OS === "android"){
        ToastAndroid.show("Erro ao tentar sair", ToastAndroid.LONG);
      }else{
        Alert.alert(error.message);
      }
    });
    })

  
    return (
      <View style={styles.container}>
        <Text>Logout</Text>
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});