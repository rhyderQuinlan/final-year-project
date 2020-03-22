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

    { this.valid ? this.props.navigation.navigate('VehicleRegistration') : null}
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Lets get started</Text>

        <View style={styles.inputView}>
          <Icon 
            name='user'
            type='antdesign'
            color='#fb5b5a'
            iconStyle={{ justifyContent: 'center', padding: 10 }}
            size={26}
          />
          <TextInput  
              style={styles.inputText}
              placeholder="Firstname..." 
              placeholderTextColor="#003f5c"
              onChangeText={firstname => this.setState({firstname})}/>
        </View>

        <View style={styles.inputView}>
          <Icon 
              name='user'
              type='antdesign'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
          <TextInput  
              style={styles.inputText}
              placeholder="Lastname..." 
              placeholderTextColor="#003f5c"
              onChangeText={lastname => this.setState({lastname})}/>
        </View>

        <View style={styles.inputView}>
          <Icon 
              name='email-outline'
              type='material-community'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
          <TextInput  
              style={styles.inputText}
              placeholder="Email Address..." 
              placeholderTextColor="#003f5c"
              onChangeText={(email) => this.setState({email})}/>
        </View>

        <View style={styles.inputView}>
          <Icon 
              name='key'
              type='antdesign'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
          <TextInput  
              style={styles.inputText}
              placeholder="Password..." 
              placeholderTextColor="#003f5c"
              onChangeText={(password) => this.setState({password})}
              secureTextEntry={true}
              />
        </View>

        <View style={styles.inputView}>
            <Icon 
              name='drivers-license-o'
              type='font-awesome'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
            <Dropdown 
                label="Licence"
                data={[{
                    value: 'Full Licence'
                }, {
                    value: 'Provisional Licence'
                }]}
                containerStyle={styles.dropdown}
                onChangeText={(value) => this.setState({ licence: value})}
                baseColor='#003f5c'
            />
        </View>

        <View>
          <Text style={{ justifyContent: 'space-around', color: 'red' }}>{this.state.error}</Text>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={() => this.createUser()}>
          <Text style={styles.loginText}>Begin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text style={styles.back}>Already have an account? Sign in.</Text>
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
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputText:{
    color:"white",
    width: '80%'
  },
  dropdown:{
    height: 40,
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  back:{
    color:"white",
    fontSize:15
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText: {
    color: 'white',
    fontSize: 20
  }
});

export default UserRegistration;