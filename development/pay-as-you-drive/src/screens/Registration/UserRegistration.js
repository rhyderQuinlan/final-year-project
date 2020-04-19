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
import firebase from 'firebase';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

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
      error: '',
       coverage: ''
    }
  }

  async componentDidMount(){
    
   }

   //EVENT: firebase call
   //create new user
  async createUser(){
    const data = await {
      email: this.state.email,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      licence: this.state.licence,
      coverage: this.state.coverage
    }

    this.valid = false

    //check if all required fields are filled
    if(data.email != '' 
    && data.firstname != '' 
    && data.lastname != '' 
    && data.licence != ''
    && data.licence != ''){

        this.valid = true

    } else {
      Toast.show("All fields are required")
    }

    //create user
    //return success
    if(this.valid){
      this.valid = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => { 
        this.setState({error: error.message})
        return false
      });
    }

    //login new user
    //return success
    if (this.valid) {
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        // this.passwordInput.clear()
        // this.emailInput.clear() TODO: commented until fixed
      }).catch((error) => {
        this.setState({error:error.message})
      });
    }
    
    //upload information to db
    if (this.valid) {  
      const { currentUser } = firebase.auth();
      await firebase.database().ref(`users/${currentUser.uid}/`).set(data)
    }

    //navigate to add vehicle screen
    { this.valid ? this.props.navigation.navigate('VehicleRegistration') : null}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image 
              source={require('../../../assets/start.png')}
              alignSelf='center'
              style={styles.image}
            />
          <Text style={styles.logo}>Lets get started</Text>
          <FormInput 
                  icon='user'
                  type='antdesign'
                  onChangeText={firstname => this.setState({firstname})}
                  placeholder='Firstname'
                />

          <FormInput 
            icon='user'
            type='antdesign'
            onChangeText={lastname => this.setState({lastname})}
            placeholder='Lastname'
          />

          <FormInput 
              icon='mail'
              type='antdesign'
              onChangeText={email => this.setState({email})}
              placeholder='Email Address'
            />

          <FormInput 
            icon='key'
            type='antdesign'
            onChangeText={password => this.setState({password})}
            placeholder='Password'
            secureTextEntry={true}
          />

          <DropdownInput 
            icon='drivers-license-o'
            type='font-awesome'
            data={[{
                value: 'Full Licence'
            }, {
                value: 'Provisional Licence'
            }]}
            onChangeText={(value) => this.setState({ licence: value})}
            label='Licence Status'
          />

          <DropdownInput 
            icon='attach-money'
            type='material'
            data={[{
                value: 'Third Party Insurance'
            }, {
                value: 'Third Party Fire & Theft'
            }, {
                value: 'Comprehensive'
            }]}
            onChangeText={(value) => this.setState({ coverage: value})}
            label='Insurance Coverage'
          />

          <View>
            <Text style={{ justifyContent: 'space-around', color: 'red' }}>{this.state.error}</Text>
          </View>

          <ButtonComponent 
            icon='arrowright'
            type='antdesign'
            text='Next'
            onPress={() => this.createUser()}
          />

          <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('LoginScreen')}>
              <Text style={styles.back}>Already have an account? Sign in.</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF1F3',
  },
  content: {
    flex: 1,
    alignSelf:'center',
    width: '80%',
    paddingTop: '10%',
  },
  logo:{
    fontWeight:"bold",
    fontSize:35,
    color:"#2E6CB5",
    marginBottom:40,
    textAlign: 'center'
  },
  back:{
    color:"#373E45",
    fontSize:15,
    textAlign: 'center'
  },
  image:{
    flex: 2,
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
});

export default UserRegistration;