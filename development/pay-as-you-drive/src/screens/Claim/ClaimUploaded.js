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

class ClaimUploaded extends Component {
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
                    <Text style={styles.logo}>Claim successfully filed</Text> 
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View>
                    <Text style={styles.text}>Your claim will now be reviewed and you will be able ot see the outcome fo the claim on your 'Claims' screen.</Text>
                </View>

                <View>
                    <ButtonComponent 
                        icon='arrowright'
                        type='antdesign'
                        text='Return Home'
                        onPress={() => this.props.navigation.navigate('BottomTab')}
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
    backgroundColor: '#373E45',
    flex: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20
  },
  contentContainer:{
    flex: 6,
    padding: 20,
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 16
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#2E6CB5",
    marginBottom:40
  }
});

export default ClaimUploaded;