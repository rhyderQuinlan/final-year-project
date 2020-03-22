import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  AsyncStorage,
  YellowBox
} from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import Toast from 'react-native-simple-toast';
import Dialog from "react-native-dialog";

import _ from 'lodash';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      error: '',
      resetPasswordDialog: false
    }
  }

  async componentDidMount(){
   }
  

  rememberUser = async () => {
    try {
      await AsyncStorage.setItem('EMAIL', this.state.email);
      await AsyncStorage.setItem('PASSWORD', this.state.password);
    } catch (error) {
      console.log("async rememberMe error: " + error)
    }
  };
  resetPassword(){
    firebase.auth().sendPasswordResetEmail(this.passwordChangeEmail)
      .then(() => alert("Password reset email sent"))
      .catch((error) => this.setState({error:error.message}))
  }

  signinUser(){
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        if(this.state.email == 'admin@payasyoudrive.com'){
          this.props.navigation.navigate('AdminOptions')
        } else {
          this.props.navigation.navigate('BottomTab')
        }
        
    }).catch((error) => {
      this.setState({error:error.message})
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

  async forgetUser(){
    try {
      await AsyncStorage.removeItem('EMAIL');
      await AsyncStorage.removeItem('PASSWORD')
    } catch (error) {
    console.log("async forgetUser error: " + error)
    }
  };

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.logo}>Welcome Back</Text>

          <View style={styles.inputView}>
            <TextInput  
                style={styles.inputText}
                placeholder="Email..." 
                placeholderTextColor="#003f5c"
                onChangeText={email => this.setState({email})}/>
          </View>
          <View style={styles.inputView}>
            <TextInput  
                style={styles.inputText}
                placeholder="Password..." 
                placeholderTextColor="#003f5c"
                onChangeText={password => this.setState({password})}
                secureTextEntry={true}
                />
          </View>

          <View style={styles.rememberMecontainer}>
              <View>
                <Text style={styles.rememberme}>Remember Me</Text>
              </View>
              
              <View>
                <Switch
                  value={this.state.rememberMe}
                  onValueChange={(value) => this.toggleRememberMe(value)}
                  trackColor='#fb5b5a'
                  thumbColor='#fb5b5a'
                />
              </View>
          </View>

          <View>
              <Dialog.Container visible={this.state.resetPasswordDialog}>
                  <Dialog.Title>Reset password</Dialog.Title>
                  <Dialog.Description>
                      Enter account email address. Then check your emails for reset link.
                  </Dialog.Description>
                  <Dialog.Input 
                      onChangeText={(passwordChangeEmail) => this.passwordChangeEmail = passwordChangeEmail}
                      label="Email Address"
                      placeholder="Enter email"
                      />
                  <Dialog.Button label="Cancel" onPress={() => this.setState({ resetPasswordDialog: false})}/>
                  <Dialog.Button label="Confirm" onPress={() => {
                      this.setState({resetPasswordDialog: false})
                      this.resetPassword()
                      }}/>
              </Dialog.Container>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={() => this.signinUser()}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('WelcomeScreen')}>
            <Text style={styles.loginText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonContainer} onPress={() => this.setState({resetPasswordDialog: true})}>
              <Text style={styles.back}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.errorcontainer}>
            <Text style={styles.error}>{this.state.error}</Text>
          </View>

          <View>
              <Dialog.Container visible={this.state.resetPasswordDialog}>
                  <Dialog.Title>Reset password</Dialog.Title>
                  <Dialog.Description>
                      Enter account email address. Then check your emails for reset link.
                  </Dialog.Description>
                  <Dialog.Input 
                      onChangeText={(passwordChangeEmail) => this.passwordChangeEmail = passwordChangeEmail}
                      label="Email Address"
                      placeholder="Enter email"
                      />
                  <Dialog.Button label="Cancel" onPress={() => this.setState({ resetPasswordDialog: false})}/>
                  <Dialog.Button label="Confirm" onPress={() => {
                      this.setState({resetPasswordDialog: false})
                      this.resetPassword()
                      }}/>
              </Dialog.Container>
          </View>
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
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputText:{
    height:50,
    color:"white"
  },
  back:{
    color:"white",
    fontSize:15,
    marginTop: 20
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    marginBottom:20
  },
  loginText: {
    color: 'white',
    fontSize: 20
  },
  rememberMecontainer: {
    flexDirection: 'row',
  },
  rememberme: {
    color: 'white',
    fontSize: 15,
    marginRight: 20,
    textAlignVertical: 'bottom'
  }
});

export default LoginScreen;