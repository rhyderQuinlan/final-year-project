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

    componentDidMount(){
        const { currentUser } = firebase.auth();
        firebase.database().ref(`/users/${currentUser.uid}/journeys/`).on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.val();
                // this.setState({totalAmount: this.state.totalAmount + childSnapshot.val()})
            })
        })
    }

    render() {
        return(
            <View style={styles.main}>
                <View>
                    <Text style={{justifyContent: 'space-around'}}>€{this.state.totalAmount}</Text>
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