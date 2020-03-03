//TODO car details
//verification api

//acting as verify in system

//TODO day/night


import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    PermissionsAndroid,
    Platform
} from 'react-native';

import Toast from 'react-native-simple-toast';
import firebase from 'firebase';
import { CountDown } from 'react-native-countdown-component';
import { Stopwatch } from 'react-native-stopwatch-timer';
import humanize from 'humanize-plus';
import ButtonComponent from '../components/ButtonComponent';

import { Client } from "@googlemaps/google-maps-services-js"; //speed limit task
import { getSunrise, getSunset } from 'sunrise-sunset-js'; //sunrise-sunset task
import { Icon } from 'react-native-elements';

const { width, height } = Dimensions.get('window')
const haversine = require('haversine')

var db_input = {
    distance: 0,
    safeTime_multiplier: 0
}

//TODO Speed limit using Road API
// const client = new Client({});

// // client
// //     .elevation({
// //         params: {
// //             locations: [{ lat: 45, lng: -110 }],
// //             key: "AIzaSyCFtPuCVniR5CEPGkcvwnHHQAJuX_y-DsA"
// //         },
// //         timeout: 1000
// //     })
// //     .then(r => {
// //         console.log(r.data.error_message);
// //     })
// //     .catch(e => {
// //         console.log(e);
// //     });

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
            error: '',
            prevTimestamp: 0,
            prevCoords: {},
            speed_test: 0,

            updatesEnabled: true,
            location: {},
            safeTime: true
        };
    }  
    
    componentDidMount() {
        this.hasLocationPermission()
        this.getLocation()

        firebase.database().ref(`/users/I0QJcZvnkZV3WkqgXvyMkoIIysY2/algorithm/`).once('value')
            .then((snapshot) => {
                db_input.distance = snapshot.val().distance
                db_input.safeTime_multiplier = snapshot.val().safeTime_multiplier
            })
            .catch((error) => {
                console.log(error)
            })
    }
    
    hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
        return true;
        }
    
        const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
    
        if (hasPermission) return true;
    
        const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
    
        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    
        if (status === PermissionsAndroid.RESULTS.DENIED) {
        Toast.show('Location permission denied by user.', Toast.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Toast.show('Location permission revoked by user.', Toast.LONG);
        }
    
        return false;
    }

    getLocation = async () => {
        const hasLocationPermission = await this.hasLocationPermission();
    
        if (!hasLocationPermission) return;
    
        this.setState({ loading: true }, () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({ 
                    location: position, 
                    loading: false,
                    prevTimestamp: position.timestamp,
                    prevCoords: {
                        latitude: position.coords.latitude, 
                        longitude: position.coords.longitude 
                    } 
                });
              console.log(position);
            },
            (error) => {
              this.setState({ location: error, loading: false });
              console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
          );
        });
    }

    getLocationUpdates = async () => {
        const hasLocationPermission = await this.hasLocationPermission();
    
        if (!hasLocationPermission) return;
    
        this.setState({ updatesEnabled: true }, () => {
          this.watchId = navigator.geolocation.watchPosition(
            (position) => {
              this.setState({ location: position });
              const { distanceTravelled, prevCoords, prevTimestamp } = this.state
              
              const newCoords = {
                  latitude: position.coords.latitude, 
                  longitude: position.coords.longitude
              }
              
              const distance = this.calcDistance(
                  prevCoords,
                  newCoords
              )
              
              const currentTimestamp = position.timestamp
              
              console.log("--- \nSpeed: " + position.coords.speed + "\n---")
              
              const speed_test = this.calcSpeed(
                  prevTimestamp, 
                  currentTimestamp, 
                  distance
              )
              
              this.setState({
                  distanceTravelled: distanceTravelled + distance,
                  prevCoords: newCoords,
                  speed_test: speed_test,
                  prevTimestamp: currentTimestamp
              })
            },
            (error) => {
              this.setState({ location: error });
              console.log(error);
            },
            { enableHighAccuracy: true, distanceFilter: 5.0, interval: 5000, fastestInterval: 2000 }
          );
        });
    }

    removeLocationUpdates = () => {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.setState({ updatesEnabled: false })
        }
    }

    //stopwatch and timer section
    getFormattedTime(time) {
        this.currentTime = time;
    };

    startJourney() {
        const { prevCoords  } = this.state
        this.setState({
            running: true, 
            stopwatchStart: true, 
            showCountdown: false, 
        })

        this.getLocation()

        //check driving time is unsafe
        const currentTime = new Date().getTime()
        if (currentTime > getSunset(prevCoords.latitude, prevCoords.longitude) || currentTime < getSunrise(prevCoords.latitude, prevCoords.longitude)) {
            this.setState({ safeTime: false })
        }

        this.getLocationUpdates()
    }

    endJourney() {
        this.removeLocationUpdates()

        const duration = this.currentTime;
        const distance = Number(this.state.distanceTravelled).toFixed(3);
        const cost_total = Number(this.calcCost(distance));
        const safeTime = this.state.safeTime
        
        const hours = new Date().getHours()
        const date = new Date().getDate()
        const month = new Date().getMonth()
        const year = new Date().getFullYear()

        const humanized_string = this.humanizeDate(hours, date, month);
        
        const date_string = `${date}/${month}/${year}`
        this.journeyCreate(distance, duration, cost_total, date_string, humanized_string, safeTime);
        
        this.setState({
            distanceTravelled: 0,
            speed: 0,
            prevCoords: {},
            prevTimestamp: 0,
            running: false, 
            stopwatchStart: false, 
            stopwatchReset: true,
            speed_test: 0,
            safeTime: true,
            updatesEnabled: false
        });
        Toast.show("Journey has come to an end")
    }

    calcCost(distance){
        
        //driving after sunset or before sunrise multiplier
        var unsafetime_addition = 0
        if (!this.state.safeTime) {
            unsafetime_addition = (distance * (db_input.safeTime_multiplier/100))
        }

        const distance_addition = distance * (db_input.distance / 100)

        const total = distance_addition + unsafetime_addition
        Toast.show(distance_addition + " + " + unsafetime_addition + " = " + total, Toast.LONG)
        return total.toFixed(2)
        //TODO refine algorithm
    }

    calcSpeed(prevTimestamp, newTimestamp, distance) {
        console.log("\n-----------\nPrevious Time Stamp: " + prevTimestamp)
        console.log(new Date(prevTimestamp).getMilliseconds())
        console.log(new Date(prevTimestamp).getSeconds())
        console.log(new Date(prevTimestamp).getMinutes())
        console.log(new Date(prevTimestamp).getHours() + "\n--------------\n")

        console.log("\n-----------\nNew Time Stamp: " + newTimestamp)
        console.log(new Date(newTimestamp).getMilliseconds())
        console.log(new Date(newTimestamp).getSeconds())
        console.log(new Date(newTimestamp).getMinutes())
        console.log(new Date(newTimestamp).getHours() + "\n-------------\n")

        const unix_time = new Date(newTimestamp).getTime() - new Date(prevTimestamp).getTime()

        console.log("\n---------------\nTime interval: " + unix_time + "\n------------\n")
    
        var speed = 0
        if(distance != 0){
            speed = distance / ((((unix_time)/1000)/60)/60) //convert to km/hr
        }

        console.log("\n\n\n----------- \nDistance: " + distance + "\nUnix Time Seconds: " + unix_time + "\nSpeed: " + speed + "\n--------\n\n\n")
        return speed
    }

    calcDistance(start, end){
        const distance = haversine(start, end, {unit: 'km'}) || 0
        return distance
    }

    journeyCreate(distance, duration, cost_total, date, humanized_date, safeTime){
        const data = {
            distance: distance,
            duration: duration,
            cost: cost_total,
            date: date,
            humanized_date: humanized_date,
            safeTime: safeTime
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

    render() {
        return(
            <View style={styles.main}>
                <View style={styles.content}>
                    <Text 
                        ref={(info) => this.errorMessage = info}
                    />
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
                            <Text style={{ fontSize: 40 }}>{parseFloat(this.state.speed_test.toString()).toFixed(2)} km/hr</Text>
                            <Stopwatch 
                                start={this.state.stopwatchStart}
                                reset={this.state.stopwatchReset}
                                options={stopwatchOptions}
                                getTime={(time) => this.getFormattedTime(time)} 
                            /> 
                            { this.state.safeTime ? 
                                (<Icon 
                                    name='eye'
                                    type='feather'
                                    color="green"
                                />)
                                :
                                (<Icon 
                                    name='eye-off'
                                    type='feather'
                                    color="red"
                                />)
                            } 
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