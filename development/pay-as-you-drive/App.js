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

//Homescreen
import HomeScreen from './src/screens/HomeScreen';

//Journey screen
import TrackJourney from './src/screens/TrackJourney';

//More settings screen
import MoreScreen from './src/screens/MoreScreen';

//Authentication
import LoginScreen from './src/screens/LoginScreen';
import UserRegistration from './src/screens/Registration/UserRegistration';

import VehicleRegistration from './src/screens/Registration/VehicleRegistration';
import ViewVehicles from './src/screens/Vehicles/ViewVehicles';
import AddVehicle from './src/screens/Vehicles/AddVehicle';
import EditUserDetails from './src/screens/User/EditUserDetails';
import WelcomeScreen from './src/screens/WelcomeScreen';

//Admin
import AdminOptions from './src/screens/Admin/AdminOptions';
import AlgorithmScreen from './src/screens/Admin/AlgorithmScreen';
import SmartContractControl from './src/screens/Admin/SmartContractControl';
import ClaimsScreen from './src/screens/Admin/ClaimsScreen'
import ReviewClaim from './src/screens/Admin/ReviewClaim'

//Claims
import ClaimInfoScreen from './src/screens/Claim/ClaimInfoScreen'
import FileClaim from './src/screens/Claim/FileClaim'
import ClaimUploaded from './src/screens/Claim/ClaimUploaded'
import ViewClaims from './src/screens/Claim/ViewClaims'
import DisplayClaim from './src/screens/Claim/DisplayClaim'

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
                name='dashboard'
                type='antdesign'
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
    activeColor: '#74A4D7',
    inactiveColor: 'white',
    barStyle: { 
      backgroundColor: '#373E45',
      elevation: 10
     },
  }
);

const MainNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        title: 'Welcome Screen',
        headerShown: false
      }
    },
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
    SmartContractControl: {
      screen: SmartContractControl,
      navigationOptions: {
        title: 'Smart Contract Control',
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
    },
    ClaimInfoScreen: {
      screen: ClaimInfoScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    FileClaim: {
      screen: FileClaim,
      navigationOptions: {
        headerShown: false
      }
    },
    ClaimUploaded: {
      screen: ClaimUploaded,
      navigationOptions: {
        headerShown: false
      }
    },
    ViewClaims: {
      screen: ViewClaims,
      navigationOptions: {
        headerShown: false
      }
    },
    DisplayClaim: {
      screen: DisplayClaim,
      navigationOptions: {
        headerShown: false
      }
    },
    ClaimsScreen: {
      screen: ClaimsScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    ReviewClaim: {
      screen: ReviewClaim,
      navigationOptions: {
        headerShown: false
      }
    },
  },
  {
    initialRouteName: 'WelcomeScreen',
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    backgroundColor: '#003f5c',
  },
});

const App = createAppContainer(MainNavigator);

export default App;