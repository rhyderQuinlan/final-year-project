import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  AsyncStorage,
  YellowBox
} from 'react-native';
import Unorderedlist from 'react-native-unordered-list';

import ButtonComponent from '../../components/ButtonComponent';
import FormInput from '../../components/FormInput';
import DropdownInput from '../../components/DropdownInput';

class ClaimInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  async componentDidMount(){
    
   }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.logo}>Make Claim</Text>
                    <Text style={{color: '#373E45', fontSize: 20, paddingHorizontal: 20}}>Please read below before continuing</Text> 
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View>
                    <Text style={styles.text}>To file a claim you will need to show the following information/documents: </Text>
                    <Unorderedlist><Text style={styles.text}>Contact information</Text></Unorderedlist>
                    <Unorderedlist><Text style={styles.text}>Description of the incident</Text></Unorderedlist>
                    <Unorderedlist><Text style={styles.text}>Quote from a mechanic/bodyshop</Text></Unorderedlist>
                    <Unorderedlist><Text style={styles.text}>Police report of the incident</Text></Unorderedlist>
                </View>

                <View>
                    <ButtonComponent 
                        icon='arrowright'
                        type='antdesign'
                        text='Begin'
                        onPress={() => this.props.navigation.navigate('FileClaim')}
                    />
                </View>
            </View>
        </View>
    )}
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  headerContainer: {
    backgroundColor: '#EFF1F3',
    flex: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20
  },
  contentContainer:{
    flex: 6,
    padding: 35,
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 16,
  },
  logo:{
    fontWeight:"bold",
    fontSize:35,
    color:"#2E6CB5",
    marginBottom:40,
    paddingHorizontal: 20
  }
});

export default ClaimInfoScreen;