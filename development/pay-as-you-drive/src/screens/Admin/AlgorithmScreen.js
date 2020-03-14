import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    ToastAndroid
} from 'react-native';
import { TextInput } from 'react-native-paper';
import firebase from 'firebase';
import AlgorithmInput from '../../components/AlgorithmInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import ButtonComponent from '../../components/ButtonComponent';
import { Icon } from 'react-native-elements';


class AdminScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distance: 0,
            nightdrive_multiplier: 0,
            heavyclass: 0,
            middleclass: 0,
            lightclass: 0
        }
        this.distance = ''
        this.nightdrive = ''
        this.heavyclass = ''
        this.middleclass = ''
        this.lightclass = ''
      }

    componentDidMount(){
        const { currentUser } = firebase.auth();

        firebase.database().ref(`/algorithm/`).once('value').then((snapshot) => {
            this.distance = snapshot.val().distance
            this.nightdrive = snapshot.val().nightdrive_multiplier
            this.heavyclass = snapshot.val().heavyclass
            this.middleclass = snapshot.val().middleclass
            this.lightclass = snapshot.val().lightclass

            this.setState({
                distance: this.distance,
                nightdrive_multiplier: this.nightdrive,
                heavyclass: this.heavyclass,
                middleclass: this.middleclass,
                lightclass: this.lightclass
            })
        })
    }

    submitChanges(){
        const { currentUser } = firebase.auth();
        const {
            distance, 
            nightdrive_multiplier,
            heavyclass,
            middleclass,
            lightclass } = this.state

        var Data = {
            distance: Number(distance),
            nightdrive_multiplier: Number(nightdrive_multiplier),
            heavyclass: Number(heavyclass),
            middleclass: Number(middleclass),
            lightclass: Number(lightclass),
          };
        
          var updates = {};
          updates[`/algorithm/`] = Data;
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
                    placeholder={this.distance.toString()}
                    onChangeText={(distance) => this.setState({distance})}
                    measurement="cents/km"
                />

                <AlgorithmInput
                    text="Night Drive"
                    placeholder={this.nightdrive.toString()}
                    onChangeText={(nightdrive_multiplier) => this.setState({nightdrive_multiplier})}
                    measurement="% additional"
                />

                <AlgorithmInput
                    text="Heavy Class"
                    placeholder={this.heavyclass.toString()}
                    onChangeText={(heavyclass) => this.setState({heavyclass})}
                    measurement="% additional"
                />

                <AlgorithmInput
                    text="Middle Class"
                    placeholder={this.middleclass.toString()}
                    onChangeText={(middleclass) => this.setState({middleclass})}
                    measurement="% additional"
                />

                <AlgorithmInput
                    text="Light Class"
                    placeholder={this.lightclass.toString()}
                    onChangeText={(lightclass) => this.setState({lightclass})}
                    measurement="% additional"
                />

                <ButtonComponent
                    onPress={() => this.submitChanges()}
                    text="Submit Changes"
                    icon="save"
                    type="antdesign"
                />    

                <TouchableOpacity 
                        style={styles.cancel}
                        onPress={() => this.props.navigation.goBack()}
                    >
                    <Text style={styles.canceltext}>Cancel</Text>
                    <Icon 
                        name="close"
                        type="antdesign"
                        style={{marginRight: 10}}
                        color="#007FF3"
                    />
                </TouchableOpacity>            
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
    },
    cancel:{
        alignSelf: 'center',
        alignContent: 'center',
        width: 250,
        backgroundColor: 'white',
        borderRadius: 400,
        borderColor: '#007FF3',
        borderWidth: 1,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '5%',
    },
    canceltext: {
        fontSize: 20,
        marginLeft: 20,
        color: '#007FF3',
        fontWeight: 'normal'
    },
})

export default AdminScreen;