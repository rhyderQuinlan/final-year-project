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
import humanize from 'humanize-plus';
import ButtonComponent from '../components/ButtonComponent';

const { width, height } = Dimensions.get('window')

var db_input = {
    distance: 0
}

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
        const duration = this.currentTime;
        const distance = Math.round(this.state.distanceTravelled);
        const cost_total = this.calcCost(distance);

        const hours = new Date().getHours()
        const date = new Date().getDate()
        const month = new Date().getMonth()
        const year = new Date().getFullYear()

        const humanized_string = this.humanizeDate(hours, date, month);
        
        const date_string = `${date}/${month}/${year}`
        this.journeyCreate(distance, duration, cost_total, date_string, humanized_string);
    }

    calcCost(distance){
        var cost_total = distance * (db_input.distance / 100)
        
        return cost_total
        //TODO refine algorithm
    }

    journeyCreate(distance, duration, cost_total, date, humanized_date){
        const data = {
            distance: distance,
            duration: duration,
            cost: cost_total,
            date: date,
            humanized_date: humanized_date
        }
        const { currentUser } = firebase.auth();
        console.log(data)
        firebase.database().ref(`users/${currentUser.uid}/journeys`)
            .push(data)
    }

    humanizeDate(hours, date, month){
        switch (hours > 12) {
            case true:
                hours = hours - 12 + "pm"
                break;
            case false:
                if(hours == 0){
                    hours = "12am"
                    break;
                }
                hours = hours + "am"
            default:
                break;
        }

        date = humanize.ordinal(date)

        switch (month) {
            case 1:
                month = "Jan"
                break;
            case 2:
                month = "Feb"
                break;
            case 3:
                month = "Mar"
                break;
            case 4:
                month = "Apr"
                break;
            case 5:
                month = "May"
                break;
            case 6:
                month = "Jun"
                break;
            case 7:
                month = "Jul"
                break;
            case 8:
                month = "Aug"
                break;
            case 9:
                month = "Sep"
                break;
            case 10:
                month = "Oct"
                break;
            case 11:
                month = "Nov"
                break;
            case 12:
                month = "Dec"
                break;        
            default:
                break;
        }
        return `${date} ${month} ${hours}`
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
            () => Toast.show('Error getting current position.'),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        )
        this.watchID = navigator.geolocation.watchPosition(
            (position) => {
                const { distanceTravelled } = this.state
                const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }
                const positionLatLngs = pick(position.coords, ['latitude', 'longitude'])
                const newSpeed = position.coords.speed
                this.setState({
                    distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
                    prevLatLng: newLatLngs,
                    speed: newSpeed
                })
            },
            () => Toast.show('Error watching position'),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
        );
        firebase.database().ref(`/users/I0QJcZvnkZV3WkqgXvyMkoIIysY2/algorithm/`).once('value')
            .then((snapshot) => {
                db_input.distance = snapshot.val().distance
            })
            .catch((error) => {
                console.log(error)
            })
    }

    calcDistance(newLatLng) {
        const { prevLatLng } = this.state
        const distance = haversine(prevLatLng, newLatLng) || 0
        return distance
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
                                digitTxtStyle={{color: '#191BAF'}}
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
                    <ButtonComponent 
                        text={!this.state.running ? "Start" : "End"}
                        icon={!this.state.running ? "arrowright" : "stop"}
                        type={!this.state.running ? "antdesign" : "foundation"}
                        onPress={() => requestAnimationFrame(() => this.toggleJourney())}
                    />
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
    summary:{
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default TrackJourney;