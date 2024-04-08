import React, { useRef, useEffect } from 'react';

import UnityView from '@azesmway/react-native-unity';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AzureAuth from 'react-native-azure-auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = 'babf4803-92a7-4c4f-9806-1f8a60bcf5be' // replace the string with YOUR client ID

 const azureAuth = new AzureAuth({
     clientId: CLIENT_ID
   });
const UnityApp = ({route}) => {

  const navigation  = useNavigation();
  const unityRef = useRef(null);
  

useEffect(() => {
   SendData(JSON.stringify(route.params));
  }, []);

// delay function help us control when to send the data to unity in ms.
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Send Data function is uses the main function that send the data to Unity.
// With the delay.
  async function SendData(data) {
    await delay(500);
    // This is the main function postMessage take 3 arguments ReacttoUnity is the game Object
    // GetDatas is the function name we will send the data to in Unity depends on hierarchy.
    // data is the data we will send.
    console.log("data",data);
    unityRef.current?.postMessage('ReactToUnity', 'GetDatas', data);
  }

  return (
    <View style={{ flex: 1 }}>
      <UnityView
        ref={unityRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 1,
          bottom: 1
        }}
        onUnityMessage={(result) => {
          if(result.nativeEvent.message =="Logout")
          {
            azureAuth.webAuth
            .clearSession()
            .then(success => {
              console.log('yes',success);
              AsyncStorage.removeItem('userName');
              navigation.navigate('App');
      })
          }
        }}
      />
    </View>
  );
};

export default UnityApp;