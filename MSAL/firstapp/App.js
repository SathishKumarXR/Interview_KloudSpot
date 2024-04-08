import React, {useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  Image
} from 'react-native';
import AzureAuth from 'react-native-azure-auth'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const CLIENT_ID = 'babf4803-92a7-4c4f-9806-1f8a60bcf5be' // replace the string with YOUR client ID

 const azureAuth = new AzureAuth({
     clientId: CLIENT_ID
   });

const Auth0Sample = ({route}) => {
  
   const [accessToken,setAccessToken]=useState(null);
   const [loggedIn,setLoggedIn]=useState(accessToken);
   const [user,setUser]=useState('');
   const navigation  = useNavigation();


   useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    try {
      
      const userName = await AsyncStorage.getItem('userName');
      const userId = await AsyncStorage.getItem('userId');
      console.log('userName',userName);
      if (userName) {
        setUser(userName);
        setLoggedIn(userName);
        navigation.navigate('UnityApp',{Username:userName,Email:userId});
      } 
      else{
        setLoggedIn(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
    
   _onLogin = async () => {
    try {
      let tokens = await azureAuth.webAuth.authorize({scope: 'openid profile User.Read' })
      await AsyncStorage.setItem('userName', tokens.userName);
      await AsyncStorage.setItem('userId', tokens.userId);
      console.log('CRED>>>', tokens);
      setAccessToken(tokens.accessToken);
      navigation.navigate('UnityApp',{Username:tokens.userName,Email:tokens.userId});
    } catch (error) {
      console.log('Error during Azure operation', error)
    }
  };

  _onLogout = () => {
    azureAuth.webAuth
      .clearSession()
      .then(success => {
        setAccessToken(null);
        setLoggedIn(null);
        setUser(null);
      })
      .catch(error => console.log(error));
  };

    return(
      <View style={styles.container}>
     <View>
       <Image style={{alignSelf:'center',width: 70, height: 70,resizeMode:'contain'}}source={require('./logo.png')} />

       <Text style={styles.header}>Kloudspot Interview</Text>
        <Text style={styles.text}>Hello {user}!</Text>
        <Text style={styles.text}>
          You are {loggedIn ? '' : 'not '}logged in.
        </Text>
      </View>  
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          onPress={loggedIn ? this._onLogout : this._onLogin}
          title={loggedIn ? 'Log Out' : 'Log In'}
        />
      </View>
     
  </View>   
    );
}
export default Auth0Sample;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color:'blue'
    
  },
  text: {
    textAlign: 'center',
    color:'black'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    padding: 20
  },
  button: {
    flex: 1,
    padding:20,
    margin:20
  },
  list: {
    flex: 5,
    margin:20
  }
});

AppRegistry.registerComponent('App', () => App);

