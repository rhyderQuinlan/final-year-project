import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import firebase from 'firebase';
import Select2 from 'react-native-select-two';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import Toast from 'react-native-simple-toast';

import ButtonComponent from '../../components/ButtonComponent';

class ViewVehicles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehiclelist: [],
            vehiclename: '',
            vehicletype: '',
            vehicleyear: 0,
            vehiclekey: '',
            selected: false
        };

        const year = (new Date()).getFullYear();
        this.years = new Array()
        for (let index = 0; index < 50; index++) {
            this.years.push({value: year - index})
        }
    }  
    async componentDidMount(){
        const { currentUser } = firebase.auth();
        
        firebase.database().ref(`/users/${currentUser.uid}/vehicles/`).on('value', snapshot => {
            var vehicle_list = []
            snapshot.forEach((childSub) => {
                vehicle_list.push({id: childSub.key, name: childSub.val().name, type: childSub.val().type, year: Number(childSub.val().year)})
            })
            this.setState({vehiclelist: vehicle_list})
        })
    }

    populate(key){
        const { vehiclelist } = this.state
        for (let index = 0; index < vehiclelist.length; index++) {
            if(vehiclelist[index].id == key){
                this.vehiclename = vehiclelist[index].name
                this.vehicletype = vehiclelist[index].type
                this.vehicleyear = vehiclelist[index].year.toString(),
                this.vehiclekey = vehiclelist[index].id
                this.setState({
                    vehiclename: vehiclelist[index].name,
                    vehicletype: vehiclelist[index].type,
                    vehicleyear: vehiclelist[index].year.toString(),
                    vehiclekey: vehiclelist[index].id,
                    selected: true
                })
                index = vehiclelist.length
            } 
            
        }
    }

    submitChanges(){
        const { currentUser } = firebase.auth();
        const {
            vehiclename,
            vehicletype,
            vehicleyear,
            vehiclekey
        } = this.state

        if(vehiclename != ''
        && vehicletype != ''
        && vehicleyear != ''
        && vehiclekey != ''
        ){
            var Data = {
                name: vehiclename,
                year: vehicleyear,
                type: vehicletype,
            }
            
            return firebase.database().ref(`/users/${currentUser.uid}/vehicles/${vehiclekey}/`).set(Data)
            .then(result => {
                alert('Changes submitted succesfully...')
            })
            .catch(error => {
                console.log(error.message) 
            })
        } else {
            Toast.show('All fields are required')
        }
    }

    deleteVehicle(){
        firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/vehicles/${this.state.vehiclekey}/`).remove()
            .then(this.setState({selected: false}))
            .catch(error => alert("Failed to delete vehicle: \n" + error))
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.logo}>View Vehicles</Text>
                    <Select2
                        isSelectSingle
                        style={{ borderRadius: 5, width: '80%', alignSelf: 'center' }}
                        colorTheme={'#2E6CB5'}
                        popupTitle='Select vehicle to edit'
                        title='Select vehicle to edit'
                        data={this.state.vehiclelist}
                        onSelect={key => {
                            this.populate(key)
                        }}
                        onRemoveItem={() => {
                            this.setState({ selected: false });
                        }} 
                        searchPlaceHolderText='Search Vehicle'
                        cancelButtonText='Cancel'
                        selectButtonText='Choose'
                        listEmptyTitle='No vehicles to show'

                    />
                    {this.state.selected ? (
                        <View style={{backgroundColor: 'white', borderRadius: 25, margin: '5%'}}>
                            <View style={{ flexDirection: 'row', alignContent: 'space-around', padding: 30}}>
                                <View style={{flex: 3}}>
                                    <TextInput
                                        style={styles.nameheader}
                                        placeholder={this.vehiclename}
                                        placeholderTextColor='#2E6CB5'
                                        underlineColorAndroid='transparent'
                                        onChangeText={(vehiclename) => this.setState({vehiclename})}
                                    />
                                </View>

                                <View style={{ flex: 1}}>
                                    <Icon 
                                        name="edit"
                                        type="antdesign"
                                        color="#2E6CB5"
                                        
                                    />
                                </View>
                            </View>

                            <Dropdown 
                                label={this.vehicleyear}
                                data={this.years}
                                containerStyle={styles.dropdown}
                                onChangeText={(vehicleyear) => this.setState({vehicleyear})}
                            />

                            <Dropdown 
                                label={this.vehicletype}
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
                                onChangeText={(vehicletype) => this.setState({vehicletype})}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert(
                                        'Delete Vehicle',
                                        'Are you sure you would like to delete vehicle?',
                                        [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Delete', 
                                            onPress: () => this.deleteVehicle(),
                                        },
                                        ],
                                    );
                                }}
                                style={{alignSelf: 'flex-end', padding: 20, marginRight: 15}}
                            >
                                <Text>Delete Vehicle</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        null
                    )}
                </View>

                <View style={styles.button}>
                    <ButtonComponent 
                        text="Save Changes"
                        icon="save"
                        type="antdesign"
                        onPress={() => this.submitChanges()}
                    />
                    <ButtonComponent 
                        text="Add Vehicle"
                        icon="plus"
                        type="antdesign"
                        onPress={() => this.props.navigation.navigate('AddVehicle')}
                    />
                    <TouchableOpacity 
                        style={styles.cancel}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Text style={styles.canceltext}>Cancel</Text>
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
        fontSize:35,
        color:"#2E6CB5",
        marginBottom:40,
        textAlign: 'center',
        paddingTop: 30
      },
    content: {
        flex: 4
    }, 
    button: {
        flex: 2
    },
    container: {
        flexDirection: 'column',
        flex: 6,
    },
    dropdown:{
        height: 50,
        marginLeft: 10,
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: 30,
        alignSelf: 'center'
      },
    nameheader: {
        fontSize: 24,
        color: '#2E6CB5',
        justifyContent: 'center',
        textAlign: 'center'
    },
    cancel:{
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
    canceltext: {
        fontSize: 20,
        marginLeft: 20,
        color: '#2E6CB5',
        fontWeight: 'normal'
    },
})

export default ViewVehicles;