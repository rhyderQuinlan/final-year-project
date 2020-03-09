import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    AsyncStorage,
    Alert
} from 'react-native';
import firebase from 'firebase';
import Select2 from 'react-native-select-two';

import ButtonComponent from '../components/ButtonComponent';
import AlgorithmInput from '../components/AlgorithmInput';

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

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.headingtext}>View Vehicles</Text>
                    <Select2
                        isSelectSingle
                        style={{ borderRadius: 5, width: '80%', alignSelf: 'center' }}
                        colorTheme={'#007FF3'}
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
                        <View>
                            <Text style={styles.headingtext}>Edit Vehicles</Text>
                            <AlgorithmInput
                                text="Car Nickname"
                                placeholder={this.state.vehiclename}
                                onChangeText={(vehiclename) => this.setState({vehiclename})}
                            />

                            <AlgorithmInput
                                text="Year"
                                placeholder={this.state.vehicleyear}
                                onChangeText={(vehicleyear) => this.setState({vehicleyear})}
                            />

                            <AlgorithmInput
                                text="Type"
                                placeholder={this.state.vehicletype}
                                onChangeText={(vehicletype) => this.setState({vehicletype})}
                            />
                        </View>
                    ) : (
                        null
                    )}
                </View>
                <View style={styles.button}>
                    <ButtonComponent 
                        text="Add Vehicle"
                        icon="plus"
                        type="antdesign"
                        onPress={() => this.props.navigation.navigate('AddVehicle')}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headingtext: {
        fontSize: 24,
        paddingTop: 20,
        color: '#007FF3',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 30
    },
    content: {
        flex: 5
    }, 
    button: {
        flex: 1
    },
    container: {
        flexDirection: 'column',
        flex: 6
    }
})

export default ViewVehicles;