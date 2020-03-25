//TODO make claim

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import firebase from 'firebase';

import ButtonComponent from '../components/ButtonComponent';

class MoreScreen extends Component {
    logout(){
        Alert.alert(
            'Logout',
            'Are you sure you would like to logout?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Logout', onPress: () => {
                    console.info("EVENT: " + firebase.auth().currentUser.email + " logged out")
                    firebase.auth().signOut()
                    this.props.navigation.navigate('WelcomeScreen')}
                },
            ],
          );
    }
    render() {
        return(
            <View style={styles.container}>
                <ButtonComponent 
                        text="Vehicles"
                        icon="car"
                        type="antdesign"
                        onPress={() => this.props.navigation.navigate('ViewVehicles')}
                    />

                <ButtonComponent 
                        text="Profile"
                        icon="user"
                        type="antdesign"
                        onPress={() => this.props.navigation.navigate('EditUserDetails')}
                    />

                <ButtonComponent 
                        text="Claims"
                        icon="solution1"
                        type="antdesign"
                        onPress={() => this.props.navigation.navigate('ClaimInfoScreen')}
                    />

                <ButtonComponent 
                        text="Logout"
                        icon="logout"
                        type="antdesign"
                        onPress={() => this.logout()}
                    />

                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('LineChartScreen')}>
                    <Text style={styles.buttonText}>Line Chart</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
      },
      logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:40
      },
});

export default MoreScreen;