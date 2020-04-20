import React from "react";
import { Button, View, Text, Form, NativeInput, StatusBar, AsyncStorage, Alert, StyleSheet, ActivityIndicator } from "react-native";

export default class SmartContractControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      key: '', 
      address:'', 
      wallet:'',
    };
  }

  render() {
    return (
        <View>
          <Text>This section is related to the Peer 2 Peer network coming in future iterations.</Text>
        </View>
          
    )
  }
}

const styles = StyleSheet.create({
  root: {
    width: '90%',
    alignSelf: 'center',
    margin:10,
  },
});
