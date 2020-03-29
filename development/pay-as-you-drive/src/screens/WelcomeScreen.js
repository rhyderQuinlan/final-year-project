import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast';
import Dialog from "react-native-dialog";

import _ from 'lodash';

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
            <Text style={styles.logo}>Pay As You Drive</Text>

            <TouchableOpacity style={styles.signupBtn} onPress={() => this.props.navigation.navigate('UserRegistration')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate('LoginScreen')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"white",
    borderColor: '#fb5b5a',
    borderWidth: 3,
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    marginBottom:30
  },
  loginText: {
    color: '#fb5b5a',
    fontSize: 20,
    fontWeight: 'bold'
  },
  signupBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    borderColor: 'white',
    borderWidth: 3,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    marginBottom:30
  },
  signupText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default WelcomeScreen;