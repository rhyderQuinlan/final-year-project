import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ImageBackground
} from 'react-native';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast'
import { Icon } from 'react-native-elements'
import _ from 'lodash'

import ButtonComponent from '../components/ButtonComponent';

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  async componentDidMount(){
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDKm0rXYcIzsl7sx3-e-GPsUFrco_Qhtqo",
        authDomain: "pay-as-you-drive-2c4ca.firebaseapp.com",
        databaseURL: "https://pay-as-you-drive-2c4ca.firebaseio.com",
        projectId: "pay-as-you-drive-2c4ca",
        storageBucket: "pay-as-you-drive-2c4ca.appspot.com",
        messagingSenderId: "1015176964135",
        appId: "1:1015176964135:web:d0b7c221fec9bb10ee0602",
        measurementId: "G-E2XJQPSRZL"
    });
    }
    
    await this.getRememberedUser();

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.forgetUser()
      }
    });
   }

  getRememberedUser = async () => {
    try {
      const email = await AsyncStorage.getItem('EMAIL');
      const password = await AsyncStorage.getItem('PASSWORD')
      if (email !== null) {
        this.setState({ email: email, password: password })
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            Toast.show('Logging you in')
            if(this.state.email == 'admin@payasyoudrive.com'){
              this.props.navigation.navigate('AdminOptions')  
            } else {
              this.props.navigation.navigate('BottomTab')  
            }      
        }).catch((error) => {
          this.setState({error:error.message})
        });
      } else {
        console.info('User not remembered')
      }
    } catch (error) {
        console.log("async getRememberedUser error: " + error)
    }
  }

  async forgetUser(){
    try {
      await AsyncStorage.removeItem('EMAIL');
      await AsyncStorage.removeItem('PASSWORD')
    } catch (error) {
      console.log("async forgetUser error: " + error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/holden-baxter-oxQ0egaQMfU-unsplash.jpg')} style={styles.image}>
            <View style={{flex:1}}>

            </View>
            
            <View style={{flex: 4}}>
              <Image 
                source={require('../../assets/logo-yellow-blue.png')}
                alignSelf='center'
                style={styles.logo}
              />
              <Text style={styles.header}>
                <Text style={{color: '#EFC066'}}>P</Text>
                ay 
                <Text style={{color: '#EFC066'}}> A</Text>
                s 
                <Text style={{color: '#EFC066'}}> Y</Text>
                ou 
                <Text style={{color: '#EFC066'}}> D</Text>rive</Text>
            </View>

            <View style={{flex: 1}}>

              </View>

            <View style={{flex: 3}}>
                <ButtonComponent 
                  text='Sign Up'
                  icon='adduser'
                  type='antdesign'
                  onPress={() => this.props.navigation.navigate('UserRegistration')}
                />

                <View>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.text}>Login</Text>
                        <Icon 
                            name='arrowright'
                            type='antdesign'
                            color="#2E6CB5"
                        />
                    </TouchableOpacity>
                </View>
              </View>
        </ImageBackground>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF1F3'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  header:{
    flex: 2,
    fontWeight:"bold",
    fontSize:40,
    color:"#373E45",
    textAlign: 'center'
  },
  logo:{
    flex: 1,
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  button:{
    alignSelf: 'center',
    alignContent: 'center',
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 400,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
    borderWidth: 2,
    borderColor: '#2E6CB5'
  },
  text: {
      fontSize: 20,
      marginLeft: 20,
      color: 'white',
      fontWeight: 'normal',
      color:"#2E6CB5",
  }
});

export default WelcomeScreen;