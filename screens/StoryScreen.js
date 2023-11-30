import React, { Component, useState,useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, Image, ScrollView, Dimensions, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Speech from 'expo-speech';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../config';
import {getDatabase, onValue, ref,update} from 'firebase/database';

SplashScreen.preventAutoHideAsync();

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default function StoryScreen({route}) {
  const[fontsLoaded,setFontsLoaded] = useState(false);
  const[speakerColor,setSpeakerColor] = useState('gray');
  const[speakerIcon,setSpeakerIcon] = useState('volume-high-outline')
  const story = route.params;
  const[light_theme, setlight_theme] = useState(true); 
  

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
  
  useEffect(() =>{
  loadFontsAsync();
  fecthUser();
  })

  const initiateTTS = async (title, author, story, moral) => {
    const current_color = speakerColor;
    setSpeakerColor(current_color === 'gray' ? '#ee8249' : 'gray');
    if (current_color === "gray") {
      Speech.speak(`${title} by ${author}`,{language:'pt-br'});
      if(Platform.OS ==='ios'){Speech.pause();}
      Speech.speak(story,{language:'pt-br'});
      if(Platform.OS ==='ios'){Speech.pause();}
      Speech.speak("A moral da história é!",{language:'pt-br'});
      Speech.speak(moral,{language:'pt-br'});
    } else {
      Speech.stop();
    }
  }
  if (!route.params) {
    navigation.navigate("Home");
    
  } else if(fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View style={light_theme ? styles.containerLight : styles.container}>
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
          <View style={styles.storyContainer}>
            <ScrollView style={light_theme ? styles.storyCardLight : styles.storyCard}>
              <Image
                source={require("../assets/story_image_1.png")}
                style={styles.image}
              ></Image>
              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style={light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>
                    {route.params.story.title}
                  </Text>
                  <Text style={light_theme ? styles.storyAuthorTextLight: styles.storyAuthorText}>
                    {route.params.story.author}
                  </Text>
                  <Text style={light_theme ? styles.storyAuthorTextLight: styles.storyAuthorText}>
                    {route.params.story.created_on}
                  </Text>
                </View>
                <View style={styles.iconContainer}>

                    <TouchableOpacity
                      onPress={() => initiateTTS(
                        route.params.story.title,
                        route.params.story.author,
                        route.params.story.story,
                        route.params.story.moral
                      )}>
                      <Ionicons
                        name={speakerIcon}
                        size={RFValue(30)}
                        color={speakerColor}
                        style={{ margin: RFValue(15) }}
                      />
                    </TouchableOpacity>

                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text style={light_theme ? styles.storyTextLight : styles.storyText}>
                  {route.params.story.story}
                </Text>
                <Text style={light_theme ? styles.moralTextLight : styles.moralText}>
                  Moral - {route.params.story.moral}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <Ionicons name={"heart"} size={RFValue(30)} color={light_theme ? "black" : "white"} />
                  <Text style={light_theme ? styles.likeTextLight : styles.likeText}>12k</Text>
                </View>
              </View>
            </ScrollView>
          </View>   
        </View>
      );
    }
  else {
    return <Text> Carregando.. </Text>
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
  storyContainer: {
    flex: 1
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20)
  },
  storyCardLight: {
    margin: RFValue(20),
    backgroundColor: "white",
    borderRadius: RFValue(20),
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2
  },
  image: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: "contain"
  },
  dataContainer: {
    flexDirection: "row",
    padding: RFValue(20)
  },
  titleTextContainer: {
    flex: 0.8
  },
  storyTitleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "white"
  },
  storyTitleTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "black"
  },
  storyAuthorText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "white"
  },
  storyAuthorTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "black"
  },
  iconContainer: {
    flex: 0.2
  },
  storyTextContainer: {
    padding: RFValue(20)
  },
  storyText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "white"
  },
  storyTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "black"
  },
  moralText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(20),
    color: "white"
  },
  moralTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(20),
    color: "black"
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: RFValue(10)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: "row",
    backgroundColor: "#eb3948",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },
  likeTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  }
});