//TODO sign out
//TODO unremember user when sign out

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  Switch,
  AsyncStorage
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast';
import { TouchableOpacity } from 'react-native-gesture-handler';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false
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

    const email = await this.getRememberedUser();

    this.setState({ 
      email: email || "", 
      rememberMe: email ? true : false });
   }
  

  rememberUser = async () => {
    try {
      await AsyncStorage.setItem('EMAIL', this.state.email);
      await AsyncStorage.setItem('PASSWORD', this.state.password);
    } catch (error) {
      console.log("async rememberMe error: " + error)
    }
  };
    
  getRememberedUser = async () => {
    try {
      const email = await AsyncStorage.getItem('EMAIL');
      const password = await AsyncStorage.getItem('PASSWORD')
      if (email !== null) {
        this.setState({ email: email, password: password })
        this.signinUser();
        return email;
      } else {
        console.log("User not remembered")
      }
    } catch (error) {
      console.log("async getRememberedUser error: " + error)
    }
  };
    
  forgetUser = async () => {
      try {
        console.log("forget user")
        await AsyncStorage.removeItem('EMAIL');
        await AsyncStorage.removeItem('PASSWORD')
      } catch (error) {
       console.log("async forgetUser error: " + error)
      }
  };

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId)
  };

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

  toggleRememberMe = value => {
    this.setState({ rememberMe: value })
      if (value === true) {
        this.rememberUser();
    } else {
      this.forgetUser();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'flex-end'}}>
          <Image 
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
        </View>
        
        <View style={{ flex: 2, justifyContent: 'center' }}>
          <View style={styles.inputContainer}>
            <View style={styles.iconTextContainer}>
              <Icon 
                    name='email-outline'
                    type='material-community'
                    style={styles.inputIcon}
                    color="#D90429"
                />
                <TextInput style={styles.inputs}
                    placeholder="Email"
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    onChangeText={(email) => this.setState({email})}/>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.iconTextContainer}>
              <Icon 
                name='key'
                type='material-community'
                style={styles.inputIcon}
                color="#D90429"
              />
              <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
            </View>
          </View>

          <View style={[styles.inputContainer, styles.rememberMe]}>
              <View>
                <Text>Remember Me</Text>
              </View>
              
              <View>
                <Switch
                  value={this.state.rememberMe}
                  onValueChange={(value) => this.toggleRememberMe(value)}
                />
              </View>
          </View>

          <TouchableHighlight underlayColor='#D8DCDE' style={ styles.loginButton} onPress={() => this.signinUser()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
              <Text>Forgot your password?</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.createUser()}>
              <Text>Register</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    
    alignItems: 'center',
  },
  inputContainer: {
    borderColor: '#2B2D42',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 4,
    width:'80%',
    height:55,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center'
  },
  rememberMe: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    borderColor: 'transparent',
    width:'40%',
  },
  inputs:{
    height:25,
    marginLeft: 10,
    width: '80%'
  },
  inputIcon:{
    width:100,
    height:100,
  },
  iconTextContainer:{
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom:10,
    width:250,
    borderRadius:5,
  },
  loginButton:{
    alignSelf: 'center',
    alignContent: 'center',
    width: '50%',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D90429',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '5%'
  },
  loginText: {
    fontSize: 26,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    left: 20,
    color: '#D90429',
    top: 2
  },
  logo:{
    width: 100,
    height: 100,
  }
});

export default LoginScreen;