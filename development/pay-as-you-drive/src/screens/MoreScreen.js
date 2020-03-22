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
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('ViewVehicles')}>
                    <Text style={styles.buttonText}>Vehicles</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('EditUserDetails')}>
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => alert("Make Claim Pressed")}>
                    <Text style={styles.buttonText}>Make Claim</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.logout()}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:40
      },
      button:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent: 'center',
        marginTop:30,
        marginBottom:20,
        
      },
      buttonText: {
        color: 'white',
        fontSize: 20
      },
});

export default MoreScreen;