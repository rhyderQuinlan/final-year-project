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
          algo_unsafe_time: 0,
          distance_input: 0,
          unsafe_multiplier: 0,
        }
      }

    componentDidMount(){
        const { currentUser } = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}/algorithm/`).once('value').then((snapshot) => {
            this.setState({
                distance_input: snapshot.val().distance,
                unsafe_multiplier: snapshot.val().safeTime_multiplier
            })
        })
    }

    submitChanges(){
        const { currentUser } = firebase.auth();
        const { algo_distance, algo_unsafe_time, distance_input, unsafe_multiplier } = this.state

        if(algo_distance == 0){
            //no change
            var distance = distance_input
        } else {
            var distance = Number(algo_distance)
        }

        if(algo_unsafe_time == 0){
            //no change
            var safeTime_multiplier = unsafe_multiplier
        } else {
            var safeTime_multiplier = Number(algo_unsafe_time)
        }

        var Data = {
            distance: distance,
            safeTime_multiplier: safeTime_multiplier
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

                <AlgorithmInput
                    text="Unsafe Time"
                    placeholder={this.state.unsafe_multiplier.toString()}
                    onChangeText={(algo_unsafe_time) => this.setState({algo_unsafe_time})}
                    measurement="% additional"
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
        color: '#007FF3'
    }
})

export default AdminScreen;