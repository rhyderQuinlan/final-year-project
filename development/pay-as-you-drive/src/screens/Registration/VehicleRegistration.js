import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import FormInput from '../../components/FormInput';
import DropdownInput from '../../components/DropdownInput';
import ButtonComponent from '../../components/ButtonComponent';

class VehicleRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      }

      if(this.vehicle.name != '' 
        && this.vehicle.year != '' 
        && this.vehicle.type != ''){

          this.valid = true

      } else {
        Toast.show("All fields are required")
      }

      if(this.valid) {
        firebase.database().ref(`users/${currentUser.uid}/vehicles/`)
            .push(this.vehicle)
        this.props.navigation.navigate('BottomTab')
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
            <View style={{flex: 3}}>
                <Image 
                  source={require('../../../assets/start.png')}
                  alignSelf='center'
                  style={styles.image}
                />
                <Text style={styles.logo}>Add your first vehicle</Text>
            </View>
          

          <View style={{flex: 3}}>
            <FormInput 
              icon='car'
              type='antdesign'
              placeholder='Vehicle Nickname'
              onChangeText={name => this.setState({name})}
            />

            <DropdownInput 
              icon='calendar'
              type='feather'
              label='Year'
              data={this.years}
              onChangeText={(value) => this.setState({ year: value})}
            />

            <DropdownInput 
              icon='list'
              type='entypo'
              label='Model Type'
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
              onChangeText={(value) => this.setState({ type: value})}
            />

            <View>
            <Text style={{ justifyContent: 'space-around', color: 'red' }}>{this.state.error}</Text>
            </View>
          </View>
          <View style={{flex:1}}>
            <ButtonComponent 
              icon='arrowright'
              type='antdesign'
              onPress={() => this.addVehicle()}
              text='Done'
            />
          </View>

          
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
  },
  logo:{
    fontWeight:"bold",
    fontSize:35,
    color:"#2E6CB5",
    marginBottom:40,
    textAlign: 'center'
  },
  image:{
    flex: 1,
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
});

export default VehicleRegistration;