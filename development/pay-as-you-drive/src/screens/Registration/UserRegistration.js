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
  AsyncStorage,
  YellowBox
} from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';

import ButtonComponent from '../../components/ButtonComponent';
import FormInput from '../../components/FormInput';
import DropdownInput from '../../components/DropdownInput';

class UserRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      licence: '',
      error: ''
    }
  }

  async componentDidMount(){
    
   }

  async createUser(){
    const data = await {
      email: this.state.email,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      licence: this.state.licence
    }

    this.valid = false

    if(data.email != '' 
    && data.firstname != '' 
    && data.lastname != '' 
    && data.licence != ''){

        this.valid = true

    } else {
      Toast.show("All fields are required")
    }

    if(this.valid){
      this.valid = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => { 
        this.setState({error: error.message})
        return false
      });
    }

    if (this.valid) {
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        // this.passwordInput.clear()
        // this.emailInput.clear() TODO: commented until fixed
      }).catch((error) => {
        this.setState({error:error.message})
      });
    }
    
    if (this.valid) {  
      const { currentUser } = firebase.auth();
      await firebase.database().ref(`users/${currentUser.uid}/`).set(data)
    }

    { this.valid ? this.props.navigation.navigate('VehicleRegistration') : Toast.show("Created user unsuccessfully")}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'space-around'}}>
          <Text>Lets get started,</Text>
        </View>
        
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <FormInput
                icon="user"
                type="antdesign"
                placeholder="First Name"
                keyboardType="default"
                onChangeText={(firstname) => this.setState({firstname})}
                // ref={(input) => { this.firstnameInput = input }}
                secureTextEntry={false}
            />
          <FormInput
              icon="user"
              type="antdesign"
              placeholder="Last Name"
              keyboardType="default"
              onChangeText={(lastname) => this.setState({lastname})}
              // ref={(input) => { this.lastnameInput = input }}
              secureTextEntry={false}
          />
          <FormInput
                icon="email-outline"
                type="material-community"
                placeholder="Email Address"
                keyboardType="email-address"
                onChangeText={(email) => this.setState({email})}
                // ref={input => { this.emailInput = input }}
                secureTextEntry={false}
            />
          <FormInput
                icon="key"
                type="antdesign"
                placeholder="Password"
                keyboardType="default"
                onChangeText={(password) => this.setState({password})}
                // ref={input => { this.passwordInput = input }}
                secureTextEntry={true}
            />
          <DropdownInput 
                icon="drivers-license-o"
                type="font-awesome"
                label="Licence"
                data={[{
                    value: 'Full Licence'
                }, {
                    value: 'Provisional Licence'
                }]}
                onChangeText={(value) => this.setState({ licence: value})}
            />
        </View>
        <View>
          <Text style={{ justifyContent: 'space-around', color: 'red' }}>{this.state.error}</Text>
        </View>

        <View style={{flex: 1}}>
          <ButtonComponent 
            text="Next"
            onPress={() => this.createUser()}
            icon="arrowright"
            type="antdesign"
          />
          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('LoginScreen')}>
              <Text>Already have an account? Sign in.</Text>
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
    borderBottomColor: '#FFD559',
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

export default UserRegistration;