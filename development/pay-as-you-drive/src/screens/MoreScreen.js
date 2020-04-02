//TODO make claim

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image
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
                <View style={{flex: 3}}>
                    <Image 
                        source={require('../../assets/driver.png')}
                        style={styles.image}
                        alignSelf='center'
                    />
                </View>
                
                <View style={{flex: 4}}>
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
                            icon='menuunfold'
                            type='antdesign'
                            text='My Claims'
                            onPress={() => this.props.navigation.navigate('ViewClaims')}
                        />

                    <ButtonComponent 
                        icon='addfile'
                        type='antdesign'
                        text='Make A Claim'
                        onPress={() => this.props.navigation.navigate('ClaimInfoScreen')}
                    />

                    <ButtonComponent 
                            text="Logout"
                            icon="logout"
                            type="antdesign"
                            onPress={() => this.logout()}
                        />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
      },
    image:{
        flex: 1,
        height: 150,
        width: 150,
        resizeMode: 'contain'
    },
});

export default MoreScreen;