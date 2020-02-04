import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements';

import HomeScreen from './src/screens/HomeScreen';
import TrackJourney from './src/screens/TrackJourney';
import MakeClaim from './src/screens/MakeClaim';
import LoginScreen from './src/screens/LoginScreen';

const BottomTab = createMaterialBottomTabNavigator(
  {
    Home: { 
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon
                name='home'
                color={tintColor}
              />
            </View>
          )
        }
      }
     },
    Journey: { 
      screen: TrackJourney,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon
                name='add-circle'
                color={tintColor}
              />
            </View>
          )
        }
      }
     },
    Claim: { 
      screen: MakeClaim,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon
                name='attach-money'
                color={tintColor}
              />
            </View>
          )
        }
      }
     },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#EF233C',
    inactiveColor: '#2B2D42',
    barStyle: { 
      backgroundColor: 'white',
      elevation: 10
     },
  }
);

const MainNavigator = createStackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        title: 'Login Screen',
        headerShown: false
      }
    },
    BottomTab: {
      screen: BottomTab,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    initialRouteName: 'LoginScreen'
  }
)

const App = createAppContainer(MainNavigator);

export default App;