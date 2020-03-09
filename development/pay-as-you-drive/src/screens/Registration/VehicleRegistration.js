import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';

import ButtonComponent from '../../components/ButtonComponent';
import FormInput from '../../components/FormInput';
import DropdownInput from '../../components/DropdownInput';

class VehicleRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehiclereg: '',
      name: '',
      year: '',
      type: '',
      error: ''  
    }

    const year = (new Date()).getFullYear();
    this.years = new Array()
    for (let index = 0; index < 50; index++) {
        this.years.push({value: year - index})
    }
  }

  async addVehicle(){
      const { currentUser } = firebase.auth()

      this.vehicle = {
        name: this.state.name,
        year: this.state.year,
        type: this.state.type
      }

      if(this.vehicle.name != '' 
        && this.vehicle.year != '' 
        && this.vehicle.type != ''){

          this.valid = true

      }
      if(this.valid) {
        firebase.database().ref(`users/${currentUser.uid}/vehicles/`)
            .push(this.vehicle)
        this.props.navigation.navigate('LoginScreen')
      } else {
        Toast.show("All fields are required")
      }

      // api.CheckCarRegistrationIreland(this.state.vehiclereg,"rhyderQuinlan", data => {
      //   console.log(data.Description);
      // });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'space-around'}}>
          <Text>Licence and Vehicle Registration</Text>
        </View>
        
        <View style={{ flex: 3, justifyContent: 'center' }}>
            <FormInput
                icon="car"
                type="antdesign"
                placeholder="Vehicle Registration Number"
                keyboardType="default"
                onChangeText={(vehiclereg) => this.setState({vehilcereg: vehiclereg})}
                secureTextEntry={false}
            />
            <FormInput
                icon="car"
                type="antdesign"
                placeholder="Vehicle Nickname"
                keyboardType="default"
                onChangeText={(vehiclename) => this.setState({name: vehiclename})}
                // ref={(input) => { this.firstnameInput = input }}
                secureTextEntry={false}
            />

            <DropdownInput 
                icon="calendar"
                type="antdesign"
                label="Year"
                data={this.years}
                onChangeText={(value) => this.setState({ year: value })}
            />

            <DropdownInput 
                icon="list"
                type="entypo"
                label="Model Type"
                data={[{
                  value: 'Hatchback'
                },{
                  value: 'Sedan'
                }, {
                  value: 'Roadster'
                },{
                  value: 'Coupe'
                },{
                  value: 'SUV'
                }, {
                  value: 'Pickup'
                },{
                  value: 'Minivan'
                }]}
                onChangeText={(value) => this.setState({ type: value })}
            />
        </View>
        <View>
          <Text style={{ justifyContent: 'space-around', color: 'red' }}>{this.state.error}</Text>
        </View>

        <View style={{flex: 1}}>
          <ButtonComponent 
            text="Done"
            onPress={() => this.addVehicle()}
            icon="check"
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

export default VehicleRegistration;