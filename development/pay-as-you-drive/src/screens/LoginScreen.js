import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email   : '',
      password: '',
    }
  }

  componentDidMount(){
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
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  signinUser(){
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        Toast.show("Login succesful")
        this.props.navigation.navigate('BottomTab')
    }).catch((error) => {
        console.log("Login: " + error.code + ": " + error.message)
    });
  }

  createUser(){
    console.log("Register attempt...")
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
        console.log("Sign up:" + error.code + ": " + error.message)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Icon 
              name='email-outline'
              type='material-community'
              style={styles.inputIcon}
          />
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
            <Icon 
              name='key'
              type='material-community'
              style={styles.inputIcon}
            />
            <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.signinUser()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.createUser()}>
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:2,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:20,
    justifyContent: 'center',
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:5,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});

export default LoginScreen;