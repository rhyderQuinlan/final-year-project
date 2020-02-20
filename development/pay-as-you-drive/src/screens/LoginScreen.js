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
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast';

import ButtonComponent from '../components/ButtonComponent';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      error: ''
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in: " + user)
      } else {
        console.log("User logged out: " + user)
        this.setState({rememberMe: false, email: '', password: ''})
        this.forgetUser()
      }
    });
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
      }
    } catch (error) {
        console.log("async getRememberedUser error: " + error)
    }
  };

    
  forgetUser = async () => {
      try {
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
        this.passwordInput.clear()
        this.emailInput.clear()
        this.props.navigation.navigate('BottomTab')
    }).catch((error) => {
      this.setState({error:error.message})
    });
  }

  createUser(){
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
        this.setState({error: error.message})
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
            source={require('../../assets/logo-yellow-blue.png')}
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
                    color="#191BAF"
                />
                <TextInput 
                    ref={input => { this.emailInput = input }}
                    style={styles.inputs}
                    placeholder="Email"
                    keyboardType="email-address"
                    underlineColorAndroid='transparent'
                    onChangeText={(email) => this.setState({email})}/>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.iconTextContainer}>
              <Icon 
                name='account-key-outline'
                type='material-community'
                style={styles.inputIcon}
                color="#191BAF"
              />
              <TextInput 
                ref={input => { this.passwordInput = input }}
                style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
            </View>
          </View>

          <View style={{width: 250, alignSelf: 'center'}}>
            <Text style={{textAlign: 'center', color: 'red'}}>{this.state.error}</Text>
          </View>

          <View style={[styles.inputContainer, styles.rememberMe]}>
              <View>
                <Text>Remember Me</Text>
              </View>
              
              <View>
                <Switch
                  value={this.state.rememberMe}
                  onValueChange={(value) => this.toggleRememberMe(value)}
                  onTintColor='#191BAF'
                  thumbColor='#F1D302'
                />
              </View>
          </View>

          <ButtonComponent 
            text="Login"
            onPress={() => this.signinUser()}
            icon="login"
            type="antdesign"
          />

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
    borderBottomColor: '#F1D302',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
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
    borderBottomColor: 'transparent',
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
  logo:{
    width: 100,
    height: 100,
  }
});

export default LoginScreen;