import {React, useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Platform, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../config';
import {getDatabase, onValue, ref,update} from 'firebase/database';


import  StoryCardScreen  from './StoryCard';

SplashScreen.preventAutoHideAsync();

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

//let stories=require("./temp.json");

export default function FeedScreen({setUpdateToFalse}) {
const[fontsLoaded,setFontsLoaded] = useState(false);
const navigation = useNavigation();
const[light_theme, setlight_theme] = useState(true);
const [stories, setStories] = useState([]);

const loadFontsAsync = async () => {
  await Font.loadAsync(customFonts);
  setFontsLoaded(true);
}

const fecthUser = async () =>  {   
  let theme;
  const datab = getDatabase();    
  
  var userId = auth.currentUser.uid;     
  
  const userUidRef = ref(datab, '/users/' + userId);
  
  onValue(userUidRef, (snapshot) => {
     const data = snapshot.val();
     theme = data.current_theme;
  });
   
   theme === 'light' ? setlight_theme(true) : setlight_theme(false);
   
}

const fecthStories = async () => {
  const datab = getDatabase();   
  const userUidRef = ref(datab, '/posts/');
  
  onValue(userUidRef, (snapshot) => {
    let stories_data = []
     const data = snapshot.val();
    
     if (snapshot.val()) {
      Object.keys(snapshot.val()).forEach(function (key) {
        stories_data.push({
          key: key,
          value: snapshot.val()[key]          
        });
        
      });
    }
    setStories(stories_data);    
    setUpdateToFalse();
  }, function(errorObject){
    console.log("A leitura falhou" + errorObject.code);
  });
}

useEffect(() =>{
loadFontsAsync();
fecthUser();
fecthStories();
}, []);


renderItem = ({ item: stories }) => {
  return <StoryCardScreen story={stories} navigation={navigation}/>;
  
};

keyExtractor = (item, index) => index.toString();

  if (fontsLoaded) {
    SplashScreen.hideAsync();
    return (
      <View style={light_theme? styles.containerLight: styles.container}>
        <SafeAreaView style={styles.droidSafeArea}/>
        <View style={styles.appTitle}>
          <View style={styles.appIcon}>
            <Image source={require("../assets/logo.png")}
            style={styles.iconImage}></Image>
          </View>
          <View style={styles.appTitleTextContainer}>
              <Text style={light_theme ? styles.appTitleTextLight : styles.appTitleText}>App Narração de Histórias</Text>
            </View>
        </View> 

        {
          !stories[0] ?          
            <View style={styles.noStories}>
              <Text style={light_theme ? styles.noStoriesTextLight : styles.noStoriesText}>Nenhuma História Disponível</Text>
            </View>
          :
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={keyExtractor}
                data={stories}
                renderItem={renderItem}
              />
            </View>
        }  

      </View>
    );
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
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
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
    width: "60px",
    height: "60px",
    resizeMode: "contain",
    marginLeft: "10"
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
  cardContainer: {
    flex: 0.93
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  }
});