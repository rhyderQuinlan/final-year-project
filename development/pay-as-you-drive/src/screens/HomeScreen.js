import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import firebase from 'firebase';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalAmount: 0,
        };
    }

    componentWillMount(){
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyDKm0rXYcIzsl7sx3-e-GPsUFrco_Qhtqo",
                authDomain: "pay-as-you-drive-2c4ca.firebaseapp.com",
                databaseURL: "https://pay-as-you-drive-2c4ca.firebaseio.com",
                projectId: "pay-as-you-drive-2c4ca",
                storageBucket: "pay-as-you-drive-2c4ca.appspot.com",
                messagingSenderId: "1015176964135",
                appId: "1:1015176964135:web:d0b7c221fec9bb10ee0602",
                measurementId: "G-E2XJQPSRZL"
            });
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    console.log('Authenticated')
                } else {
                    console.log('Not Authenticated')
                    this.props.navigation.navigate('LoginScreen')
                }
            })
        }
    }

    render() {
        return(
            <View style={styles.main}>
                <View>
                    <Text>€{this.state.totalAmount}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    }
});

export default HomeScreen;