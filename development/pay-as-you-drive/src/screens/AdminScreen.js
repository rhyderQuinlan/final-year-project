import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    ToastAndroid
} from 'react-native';
import { TextInput } from 'react-native-paper';
import firebase from 'firebase';
import AlgorithmInput from '../components/AlgorithmInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import ButtonComponent from '../components/ButtonComponent';


class AdminScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          algo_distance: 0,
          distance_input: 0
        }
      }

    componentDidMount(){
        const { currentUser } = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}/algorithm/`).once('value').then((snapshot) => {
            this.setState({distance_input: snapshot.val().distance})
        })
    }

    submitChanges(){
        const { currentUser } = firebase.auth();
        var Data = {
            distance: Number(this.state.algo_distance)
          };
        
          var updates = {};
          updates[`/users/${currentUser.uid}/algorithm/`] = Data;
          console.log(Data)
        
          return firebase.database().ref().update(updates)
            .then(result => {
                alert('Changes submitted succesfully...')
            })
            .catch(error => {
                console.log(error.message) 
            })
    }

    render(){
        return(
            <View>
                <View>
                    <Text style={styles.heading}>Adjust Insurance Algorithm</Text> 
                </View>
                
                <AlgorithmInput
                    text="Distance"
                    placeholder={this.state.distance_input.toString()}
                    onChangeText={(algo_distance) => this.setState({algo_distance})}
                    measurement="cents/km"
                />

                <ButtonComponent
                    onPress={() => this.submitChanges()}
                    text="Submit Changes"
                    icon="save"
                    type="antdesign"
                />                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading:{
        textAlign: 'center',
        padding: 20,
        fontSize: 28,
        color: '#191BAF'
    }
})

export default AdminScreen;