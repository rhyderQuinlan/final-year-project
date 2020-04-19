import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    PermissionsAndroid,
    Platform,
    TouchableOpacity
} from 'react-native';

class SmartContractControl extends Component {
    render(){
        return(
            <View>
                <Text>Smart Contract Control</Text>
                <TouchableOpacity>Enroll Admin</TouchableOpacity>
            </View>
        )
    }
}

export default SmartContractControl;