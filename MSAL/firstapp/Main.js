import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import App from './App';
import UnityApp from './UnityApp';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen
          name="App"
          component={App}
          options={{headerShown: false}}
        />
        <Stack.Screen name="UnityApp" component={UnityApp}options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export  default MyStack;