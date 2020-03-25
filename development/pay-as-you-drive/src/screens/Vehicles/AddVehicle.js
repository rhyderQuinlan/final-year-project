import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import ButtonComponent from '../../components/ButtonComponent';
import FormInput from '../../components/FormInput';
import DropdownInput from '../../components/DropdownInput';

class AddVehicle extends Component {
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
              .then(() => {
                alert("Vehicle created successfully")
                this.props.navigation.goBack()
              })
              .catch(error => {
                  Toast.show("Error adding vehicle:" + error)
              })
            
        } else {
          Toast.show("All fields are required")
        }
    }

    render(){
        return(
            <View style={styles.container}>                
                <View style={styles.content}>
                    <Text style={styles.logo}>Add New Vehicle</Text>
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

                <View style={{flex: 2}}>
                    <ButtonComponent 
                    text="Submit"
                    onPress={() => this.addVehicle()}
                    icon="check"
                    type="antdesign"
                    />
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Text style={styles.text}>Cancel</Text>
                        <Icon 
                            name="close"
                            type="antdesign"
                            style={{marginRight: 10}}
                            color="#2E6CB5"
                        />
                    </TouchableOpacity>
                </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#2E6CB5",
        marginBottom:40,
        textAlign: 'center'
      },
    content: {
        flex: 4,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    container: {
        flexDirection: 'column',
        flex: 6,
    },
    button:{
        alignSelf: 'center',
        alignContent: 'center',
        width: '70%',
        backgroundColor: 'white',
        borderRadius: 400,
        borderColor: '#2E6CB5',
        borderWidth: 1,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '5%',
    },
    text: {
        fontSize: 20,
        marginLeft: 20,
        color: '#2E6CB5',
        fontWeight: 'normal'
    },
})

export default AddVehicle;