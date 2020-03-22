import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';

import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

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
        type: this.state.type,
        registration: this.state.vehiclereg
      }

      if(this.vehicle.name != '' 
        && this.vehicle.year != '' 
        && this.vehicle.type != ''
        && this.vehicle.registration != ''){

          this.valid = true

      } else {
        Toast.show("All fields are required")
      }

      if(this.valid) {
        firebase.database().ref(`users/${currentUser.uid}/vehicles/`)
            .push(this.vehicle)
        this.props.navigation.navigate('BottomTab')
      }

      // api.CheckCarRegistrationIreland(this.state.vehiclereg,"rhyderQuinlan", data => {
      //   console.log(data.Description);
      // });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Add your first vehicle</Text>

          <View style={styles.inputView}>
            <Icon 
              name='car'
              type='antdesign'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
            <TextInput  
                style={styles.inputText}
                placeholder="Vehicle Registration Number" 
                placeholderTextColor="#003f5c"
                onChangeText={vehiclereg => this.setState({vehiclereg})}/>
          </View>

          <View style={styles.inputView}>
            <Icon 
                name='car'
                type='antdesign'
                color='#fb5b5a'
                iconStyle={{ justifyContent: 'center', padding: 10 }}
                size={26}
              />
            <TextInput  
                style={styles.inputText}
                placeholder="Vehicle Nickname" 
                placeholderTextColor="#003f5c"
                onChangeText={name => this.setState({name})}/>
          </View>

          <View style={styles.inputView}>
            <Icon 
              name='calendar'
              type='feather'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
            <Dropdown 
                label="Year"
                data={this.years}
                containerStyle={styles.dropdown}
                onChangeText={(value) => this.setState({ year: value})}
                baseColor='#003f5c'
            />
        </View>

        <View style={styles.inputView}>
            <Icon 
              name='list'
              type='entypo'
              color='#fb5b5a'
              iconStyle={{ justifyContent: 'center', padding: 10 }}
              size={26}
            />
            <Dropdown 
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
                containerStyle={styles.dropdown}
                onChangeText={(value) => this.setState({ type: value})}
                baseColor='#003f5c'
            />
        </View>

        <View>
          <Text style={{ justifyContent: 'space-around', color: 'red' }}>{this.state.error}</Text>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={() => this.addVehicle()}>
          <Text style={styles.loginText}>Done</Text>
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

export default VehicleRegistration;