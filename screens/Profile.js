import {React, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Switch,StatusBar } from 'react-native';
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { RFValue } from "react-native-responsive-fontsize";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { auth} from '../config';
import {getDatabase, onValue, ref,update} from 'firebase/database';

import { useNavigation } from '@react-navigation/native';


SplashScreen.preventAutoHideAsync();

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

const appIcon = require("../assets/logo.png");


export default function ProfileScreen() {
  const[fontsLoaded, setFontsLoaded] = useState(false);  
  const[isEnabled, setIsEnable] = useState(false);  
  const[light_theme, setlight_theme] = useState(true);  
  const[name, setName] = useState("");  
  
  const navigation = useNavigation();

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  }
  
  useEffect(() =>{
  loadFontsAsync();
  fecthUser();
  })

  const fecthUser = async () =>  {
    //https://firebase.google.com/docs/database/web/read-and-write?hl=pt-br

    let theme, nameUser, image;
    const datab = getDatabase();    
    
    var userId = auth.currentUser.uid;     
    
    const userUidRef = ref(datab, '/users/' + userId);
    
     onValue(userUidRef, (snapshot) => {
       const data = snapshot.val();
       theme = data.current_theme;
       nameUser = `${data.firstName} ${data.lastName}`;
     });
     
     if(theme === "light"){
      setlight_theme(true);
      setIsEnable(false);
    }else{
      setlight_theme(false);
      setIsEnable(true);
    }
    setName(nameUser);
  }

  const toggleSwitch = ()=> {
    const dataBD = getDatabase();
    const previous_state = isEnabled;
    const theme = !isEnabled ? "dark" : "light";
    var updates = {};

    updates[
        "/users/" + auth.currentUser.uid + "/current_theme"
      ] = theme;
         
        setIsEnable(!previous_state);
        setlight_theme(previous_state);
  
       update(ref(dataBD), updates);
  }

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
        <View style={light_theme? styles.containerLight: styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={light_theme ? styles.appTitleTextLight : styles.appTitleText}>App Narração de Histórias</Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require("../assets/profile_img.png")}
                style={styles.profileImage}
              ></Image>
              <Text style={light_theme ? styles.nameTextLight : styles.nameText}>{name}</Text>
            </View>
            <View style={styles.themeContainer}>
              <Text style={light_theme ? styles.themeTextLight : styles.themeText}>Tema escuro</Text>
              <Switch
                style={{
                  transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
                }}
                trackColor={{ false: "#767577", true: light_theme ? "#eee" : "white" }}
                thumbColor={isEnabled ? "#ee8249" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch()}
                value={isEnabled}
              />
            </View>
            <View style={{ flex: 0.3 }} />
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
    )
  }  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#15193c"
    },
    containerLight: {
      flex: 1,
      backgroundColor: "white"
    },
    droidSafeArea: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    appTitle: {
      flex: 0.07,
      flexDirection: "row"
    },
    appIcon: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center"
    },
    iconImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain"
    },
    appTitleTextContainer: {
      flex: 0.7,
      justifyContent: "center"
    },
    appTitleText: {
      color: "white",
      fontSize: RFValue(28),
      fontFamily: "Bubblegum-Sans"
    },
    appTitleTextLight: {
      color: "black",
      fontSize: RFValue(28),
      fontFamily: "Bubblegum-Sans"
    },
    screenContainer: {
      flex: 0.85
    },
    profileImageContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    profileImage: {
      width: RFValue(140),
      height: RFValue(140),
      borderRadius: RFValue(70)
    },
    nameText: {
      color: "white",
      fontSize: RFValue(40),
      fontFamily: "Bubblegum-Sans",
      marginTop: RFValue(10)
    },
    nameTextLight: {
      color: "black",
      fontSize: RFValue(40),
      fontFamily: "Bubblegum-Sans",
      marginTop: RFValue(10)
    },
    themeContainer: {
      flex: 0.2,
      flexDirection: "row",
      justifyContent: "center",
      marginTop: RFValue(20)
    },
    themeText: {
      color: "white",
      fontSize: RFValue(30),
      fontFamily: "Bubblegum-Sans",
      marginRight: RFValue(15)
    },
    themeTextLight: {
      color: "black",
      fontSize: RFValue(30),
      fontFamily: "Bubblegum-Sans",
      marginRight: RFValue(15)
    }
  });