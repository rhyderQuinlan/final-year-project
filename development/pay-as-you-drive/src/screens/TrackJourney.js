import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    PermissionsAndroid
} from 'react-native';
import haversine from 'haversine';
import pick from 'lodash/pick';
import Toast from 'react-native-simple-toast';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
import { CountDown } from 'react-native-countdown-component';
import { Stopwatch } from 'react-native-stopwatch-timer';

const { width, height } = Dimensions.get('window')

class TrackJourney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false,
            stopwatchStart: false,
            stopwatchReset: false,

            showCountdown: false,
            showStopwatch: false,

            distanceTravelled: 0,
            speed: 0,
            prevLatLng: {},

            score: 90,
        };
    }

    //stopwatch and timer section
    getFormattedTime(time) {
        this.currentTime = time;
    };

    startJourney() {
        this.setState({running: true, stopwatchStart: true, showCountdown: false});
    }

    endJourney() {
        this.setState({running: false, stopwatchStart: false, stopwatchReset: true});
        const time = this.currentTime;
        const distance = this.state.distanceTravelled;
        const cost = this.calcCost(time, distance);
        this.journeyCreate(distance, time, cost);
    }

    //3 2 1 countdown section
    countdown() {
        this.setState({showCountdown: true});
    }

    toggleJourney() {
        switch (this.state.running) {
            case true:
                this.endJourney();
                break;
            case false:
                this.setState({showCountdown: true});
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => console.log('Succesfully got current position.'),
            () => Toast.show('Error getting current position.'),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        )
        this.watchID = navigator.geolocation.watchPosition(
            (position) => {
                console.log(JSON.stringify(position))
                const { distanceTravelled } = this.state
                const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }
                const positionLatLngs = pick(position.coords, ['latitude', 'longitude'])
                const newSpeed = position.coords.speed
                this.setState({
                    distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
                    prevLatLng: newLatLngs,
                    speed: newSpeed
                })

                console.log('Speed --- ' + newSpeed)
            },
            () => Toast.show('Error watching position'),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
        );
    }

    calcDistance(newLatLng) {
        const { prevLatLng } = this.state
        const distance = haversine(prevLatLng, newLatLng) || 0
        return distance
    }

    calcCost(time, distance){
        //need to work out cost algorthm
        const cost = 10 + (distance * 0.1)
        return cost
    }

    journeyCreate(distance, time, cost){
        const { currentUser } = firebase.auth();
        firebase.database().ref(`users/${currentUser.uid}/journeys`)
            .push({ distance, time, cost })
    }

    render() {
        return(
            <View style={styles.main}>
                <View style={styles.content}>
                    {this.state.showCountdown ? (
                        <View>
                            <CountDown
                                until={3}
                                size={50}
                                digitStyle={{backgroundColor: ''}}
                                onFinish={() => this.startJourney()}
                                digitTxtStyle={{color: '#D90429'}}
                                timeToShow={['S']}
                                timeLabels={{s: ' '}}
                            />
                        </View>
                        
                    ) : (
                        null
                    )}
                        
                    {this.state.running ? (
                        <View style={styles.summary}>
                            <Text>SUMMARY</Text>
                            <Text style={{ fontSize: 40 }}>{parseFloat(this.state.distanceTravelled).toFixed(2)} km</Text>
                            <Text style={{ fontSize: 40 }}>{parseFloat(this.state.speed).toFixed(2)} km/hr</Text>
                            <Stopwatch 
                                start={this.state.stopwatchStart}
                                reset={this.state.stopwatchReset}
                                options={stopwatchOptions}
                                getTime={(time) => this.getFormattedTime(time)} 
                            />  
                        </View>           
                    ) : (
                        <View>
                            <Text>Begin Journey?</Text>
                        </View>
                    )}
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.journeyButton}
                        onPress={() => requestAnimationFrame(() => this.toggleJourney())}
                    >
                        <View>
                            <Text style={styles.buttonText}>{!this.state.running ? "Start" : "End"}</Text>
                        </View>
                        <View>
                            <Icon 
                                name='arrow-forward'
                                color='#D90429'
                                style={styles.buttonIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>                
            </View>
        )}
}

const stopwatchOptions = {
    container: {
        alignSelf: 'center',    
        padding: 5,
        borderRadius: 5,
        width: 220,
    },
    text: {
        fontSize: 40,
        color: '#2B2D42',
        alignSelf: 'center'
    }
};

const styles = StyleSheet.create({
    main:{
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    content:{
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button:{
        flex: 1
    },
    journeyButton:{
        alignSelf: 'center',
        width: 300,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#D90429',
        padding: 30,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 60
    },
    buttonText: {
        fontSize: 26,
        textAlign: 'center',
        color: '#D90429',

        //this positioning needs work
        position: 'relative',
        bottom: 12
    },
    buttonIcon: {

    },
    summary:{
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default TrackJourney;