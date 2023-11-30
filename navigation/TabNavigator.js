import {React, useState, useEffect} from 'react';
import { StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { RFValue } from "react-native-responsive-fontsize";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../config';
import {getDatabase, onValue, ref,update} from 'firebase/database';

import FeedScreen from '../screens/Feed';
import CreateStoryScreen from "../screens/CreateStory";

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabNavigator() {
  const[light_theme, setlight_theme] = useState(true);    
  const[isUpdate, setIsUpdate] = useState(false);
   
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

    const RenderFeed = (props) => {
      return <FeedScreen setUpdateToFalse={removeUpdated} {...props} />;
    };

    const RenderStory = (props) => {
      return <CreateStoryScreen setUpdateToTrue={changeUpdated} {...props} />;
    };

    changeUpdated = () => {
      setIsUpdate(true);
    };
  
    removeUpdated = () => {
      setIsUpdate(false);
    };
    
    useEffect(() =>{
      fecthUser();
      })

  return (
      <Tab.Navigator
        labeled={false}
        barStyle={light_theme ? styles.bottomTabStyleLight : styles.bottomTabStyle}
        screenOptions={({route}) =>({
          tabBarIcon:({focused, color, size}) =>{
            let iconName;
            if(route.name === 'Feed'){
              iconName = focused ?'home' : 'home-outline';
            }else if(route.name === 'Criar História'){
              iconName = focused ?'add-circle' : 'add-circle-outline'; 
            }
            return ( 
            <Ionicons 
            name={iconName} 
            size={RFValue(25)} 
            color={color}
            style={styles.icons}
            />
            );
          }          
        })}
        activeColor= {"#ee8249"}
        inativeColor= {light_theme ? "gray" : "#eaeaea"}         
      >
        <Tab.Screen name="Feed" component={RenderFeed} options={{unmountOnBlur: true}} />
        <Tab.Screen name="Criar História" component={RenderStory} options={{unmountOnBlur: true}}/>
      </Tab.Navigator>
  );
}



const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: "#2f345d",
    height: "8%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute"
  },
  bottomTabStyleLight: {
    backgroundColor: "#eaeaea",
    height: "8%",
    borderTopLeftRadius: RFValue(30),
    borderTopRightRadius: RFValue(30),
    overflow: "hidden",
    position: "absolute"
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30)
  }
});



