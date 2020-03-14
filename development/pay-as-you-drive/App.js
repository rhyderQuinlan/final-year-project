import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  YellowBox
} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements';

import HomeScreen from './src/screens/HomeScreen';
import TrackJourney from './src/screens/TrackJourney';
import MoreScreen from './src/screens/MoreScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminOptions from './src/screens/Admin/AdminOptions';
import AlgorithmScreen from './src/screens/Admin/AlgorithmScreen';
import RNLocationScreen from './src/screens/RNLocationScreen';
import UserRegistration from './src/screens/Registration/UserRegistration';
import VehicleRegistration from './src/screens/Registration/VehicleRegistration';
import ViewVehicles from './src/screens/Vehicles/ViewVehicles';
import AddVehicle from './src/screens/Vehicles/AddVehicle';
import EditUserDetails from './src/screens/User/EditUserDetails';

console.disableYellowBox = true;

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
    More: { 
      screen: MoreScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon
                name='more-horizontal'
                type='feather'
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
    activeColor: '#FFD559',
    inactiveColor: '#EFF1F3',
    barStyle: { 
      backgroundColor: '#007FF3',
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
    AdminOptions:{
      screen: AdminOptions,
      navigationOptions: {
        title: 'Admin Options',
        headerShown: false
      }
    },
    AlgorithmScreen:{
      screen: AlgorithmScreen,
      navigationOptions: {
        title: 'Algorithm Screen',
        headerShown: false
      }
    },
    RNLocationScreen:{
      screen: RNLocationScreen,
      navigationOptions: {
        title: 'RNLocation Screen',
      }
    },
    UserRegistration:{
      screen: UserRegistration,
      navigationOptions: {
        title: 'User Registration',
        headerShown: false
      }
    },
    VehicleRegistration:{
      screen: VehicleRegistration,
      navigationOptions: {
        title: 'Vehicle Registration',
        headerShown: false
      }
    },
    ViewVehicles: {
      screen: ViewVehicles,
      navigationOptions: {
        title: 'View Vehicles',
        headerTitleStyle: {
          alignSelf: 'center'
        }
      }
    },
    AddVehicle: {
      screen: AddVehicle,
      navigationOptions: {
        title: 'Add New Vehicle',
        headerTitleStyle: {
          alignSelf: 'center'
        }
      }
    },
    EditUserDetails: {
      screen: EditUserDetails,
      navigationOptions: {
        title: 'View & Edit Details',
        headerTitleStyle: {
          alignSelf: 'center'
        }
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
    initialRouteName: 'LoginScreen',
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    backgroundColor: '#007FF3',
  },
});

const App = createAppContainer(MainNavigator);

export default App;