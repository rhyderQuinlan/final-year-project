//TODO car age algorithm
//TODO aggressiveness

//thoughts:
//verification api
//flat rate
//acting as verify in system    


import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    PermissionsAndroid,
    Platform,
    TouchableOpacity
} from 'react-native';

import Toast from 'react-native-simple-toast';
import firebase from 'firebase';
import { CountDown } from 'react-native-countdown-component';
import { Stopwatch } from 'react-native-stopwatch-timer';
import humanize from 'humanize-plus';
import Geocoder from 'react-native-geocoding';
import { 
    Accelerometer,
    Gyroscope,
    DeviceMotion
 } from 'expo-sensors';
import Geolocation from 'react-native-geolocation-service';
import ButtonComponent from '../components/ButtonComponent';
import Select2 from 'react-native-select-two';
import _ from 'lodash';

import { Client } from "@googlemaps/google-maps-services-js"; //speed limit task
import { getSunrise, getSunset } from 'sunrise-sunset-js'; //sunrise-sunset task

import { ScrollView, FlatList } from 'react-native-gesture-handler';
import JourneyOption from '../components/JourneyOption';

const { width, height } = Dimensions.get('window')
const haversine = require('haversine')

var db_input = {}

Geocoder.init("AIzaSyBsJhvcHPCNm5heLKAO69RCtST6oqloGJE")

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
            journeyCost: 0,

            updatesEnabled: true,
            location: {},
            nightdrive: false,
            address: null,
            currentTime: 0,
            billing_month: '',

            vehiclelist: [],
            vehiclename: '',
            vehicletype: '',
            vehicleyear: 0,
            vehiclekey: '',

            accelerometerData: {},
            gyroscopeData: {},
            devicemotionData: {},
            acceleration: 0,
            gyroscope_acceleration: 0,
            x: 0,
            y: 0,
            z: 0
        };
    }  
    
    async componentDidMount() {
        this.hasLocationPermission()
        this.getLocation()

        await firebase.database().ref(`/algorithm/`).once('value')
            .then((snapshot) => {
                db_input.distance = snapshot.val().distance
                db_input.nightdrive_multiplier = snapshot.val().nightdrive_multiplier
                db_input.lightclass = snapshot.val().lightclass
                db_input.middleclass = snapshot.val().middleclass
                db_input.heavyclass = snapshot.val().lightclass
            })
            .catch((error) => {
                console.log(error)
            })

        const { currentUser } = firebase.auth();
        
        firebase.database().ref(`/users/${currentUser.uid}/vehicles/`).on('value', snapshot => {
            var vehicle_list = []
            snapshot.forEach((childSub) => {
                vehicle_list.push({id: childSub.key, name: childSub.val().name, type: childSub.val().type, year: Number(childSub.val().year)})
            })
            this.setState({vehiclelist: vehicle_list})
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
              Geocoder.from(position.coords.latitude, position.coords.longitude)
                .then(json => {
                    const json_address = json.results[0].address_components
                    var address_component = json_address[3].long_name + ", " + json_address[4].long_name
                    this.setState({
                        address: address_component
                    })
                })
                .catch(error => console.warn(error))
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
              
              const speed = this.calcSpeed(
                  prevTimestamp, 
                  currentTimestamp, 
                  distance
              )
              
              this.setState({
                  distanceTravelled: distanceTravelled + distance,
                  prevCoords: newCoords,
                  speed: speed,
                  prevTimestamp: currentTimestamp
              })

              this.calcCost(this.state.distanceTravelled)
            },
            (error) => {
              this.setState({ location: error });
              console.log(error);
            },
            { enableHighAccuracy: true, distanceFilter: 5.0, interval: 1000, fastestInterval: 2000 }
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
            this.setState({ nightdrive: true })
        }

        this.state.vehiclelist.forEach((child, index) => {
            if(child.checked == true){
                this.setState({ vehiclename: child.name, vehicletype: child.type, vehicleyear: child.year })
            }
        })

        this.getLocationUpdates()
    }

    endJourney() {
        this.removeLocationUpdates()

        const duration = this.currentTime;
        const distance = Number(this.state.distanceTravelled).toFixed(3);
        const cost_total = Number(this.calcCost(distance));
        const nightdrive = this.state.nightdrive
        const address = this.state.address
        const vehiclename = this.state.vehiclename
        const vehiclekey = this.state.vehiclekey
        
        const hours = new Date().getHours()
        const date = new Date().getDate()
        const month = new Date().getMonth()
        const year = new Date().getFullYear()

        const humanized_string = this.humanizeDate(hours, date, month);

        const billing_month = this.state.billing_month
        
        const date_string = `${date}/${month}/${year}`
        this.journeyCreate(address, distance, duration, cost_total, date_string, humanized_string, nightdrive, vehiclename, vehiclekey, billing_month);
        
        this.setState({
            distanceTravelled: 0,
            speed: 0,
            prevCoords: {},
            prevTimestamp: 0,
            running: false, 
            stopwatchStart: false, 
            stopwatchReset: true,
            speed: 0,
            nightdrive: false,
            updatesEnabled: false
        });

        Toast.show("Journey has come to an end")
    }

    calcCost(distance){
        console.log(db_input)

        console.log(this.state.vehicletype)
        //driving after sunset or before sunrise multiplier
        var nightdrive_addition = 0
        if (this.state.nightdrive) {
            nightdrive_addition = distance * db_input.nightdrive_multiplier/100
        }

        switch (this.state.vehicletype) {
            case 'SUV':
            case 'Pickup':
            case 'Minivan':
                console.log('CARTYPE: Heavy class')
                var vehicletype_addition = distance * (db_input.heavyclass / 100)
                break;
            case 'Coupe':
            case 'Roadster':
            case 'Sedan':
                console.log('CARTYPE: Middle class')
                var vehicletype_addition = distance * (db_input.middleclass / 100)
                break;
            case 'Hatchback':
                console.log('CARTYPE: Light class')
                var vehicletype_addition = distance * (db_input.lightclass / 100)
                break;
            default:
                console.warn('ERROR: Vehicle type error in calculation')
                var vehicletype_addition = 0
                break;
        }

        const distance_addition = distance * db_input.distance / 100

        console.log("------------------------- Algorithm ---------------------------\nDistance: " + distance + " nightdrive_multiplier: " + db_input.nightdrive_multiplier + " vehicletype_addition: " + vehicletype_addition + "\n")
        console.log(distance_addition + " + " + vehicletype_addition + " + " + nightdrive_addition + "\n---------------------------------------------------------")

        const total = distance_addition + nightdrive_addition + vehicletype_addition
        this.setState({journeyCost: total})
        return total.toFixed(2)
    }

    calcSpeed(prevTimestamp, newTimestamp, distance) {
        const unix_time = new Date(newTimestamp).getTime() - new Date(prevTimestamp).getTime()
    
        var speed = 0
        if(distance != 0){
            speed = distance / ((((unix_time)/1000)/60)/60) //convert to km/hr
        }

        return speed
    }

    calcDistance(start, end){
        const distance = haversine(start, end, {unit: 'km'}) || 0
        return distance
    }

    journeyCreate(address, distance, duration, cost_total, date, humanized_date, nightdrive, vehiclename, vehiclekey, billing_month){
        const data = {
            address: address,
            distance: distance,
            duration: duration,
            cost: cost_total,
            date: date,
            humanized_date: humanized_date,
            nightdrive: nightdrive,
            vehiclename: vehiclename,
            vehiclekey: vehiclekey,
            billing_month: billing_month
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
                if(hours == 12){
                    hours = "12pm"
                    break;
                }

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
            case 0:
                month = "Jan"
                break;
            case 1:
                month = "Feb"
                break;
            case 2:
                month = "Mar"
                break;
            case 3:
                month = "Apr"
                break;
            case 4:
                month = "May"
                break;
            case 5:
                month = "Jun"
                break;
            case 6:
                month = "Jul"
                break;
            case 7:
                month = "Aug"
                break;
            case 8:
                month = "Sep"
                break;
            case 9:
                month = "Oct"
                break;
            case 10:
                month = "Nov"
                break;
            case 11:
                month = "Dec"
                break;        
            default:
                break;
        }
        this.setState({billing_month: month})
        return `${date} ${month} ${hours}`
    }

    //3 2 1 countdown section
    countdown() {
        this.setState({showCountdown: true});
    }

    cancelPressed() {
        this.setState({
            showCountdown: false
        })
    }

    round(n) {
        if (!n) {
          return 0;
        }
      
        return Math.floor(n * 100) / 100;
      }

    render() {
        const { gyroscopeData, accelerometerData, devicemotion_acceleration, acceleration, gyroscope_acceleration, speed } = this.state
        return(
            <View style={styles.container}>
                    
                <View style={styles.contentContainer}>
                <Text 
                        ref={(info) => this.errorMessage = info}
                    />
                    {this.state.showCountdown ? (
                        <View>
                            <Text style={styles.headingtext}>Beginning Journey</Text>
                            <CountDown
                                until={3}
                                size={50}
                                digitStyle={{backgroundColor: ''}}
                                onFinish={() => this.startJourney()}
                                digitTxtStyle={{color: '#007FF3'}}
                                timeToShow={['S']}
                                timeLabels={{s: ' '}}
                            />
                        </View>
                        
                    ) : (
                        this.state.running ? (
                        <View style={styles.summary}>
                            <View style={
                                {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    padding: 20,
                                    borderColor: 'white',
                                    borderBottomWidth: 1,
                                    width: '100%'
                                }
                            }>
                                <Stopwatch 
                                    start={this.state.stopwatchStart}
                                    reset={this.state.stopwatchReset}
                                    options={stopwatchOptions}
                                    getTime={(time) => this.getFormattedTime(time)} 
                                /> 
                            </View>
                            { this.state.nightdrive ? 
                                (<JourneyOption 
                                    icon='moon'
                                    type='feather'
                                    text=' Night drive'
                                />)
                                :
                                (<JourneyOption 
                                    icon='sun'
                                    type='feather'
                                    text=' Day drive'
                                />)
                            }
                            <JourneyOption 
                                icon='map-marker-distance'
                                type='material-community'
                                text={this.state.distanceTravelled.toFixed(2).toString() + " Km"}
                            />
                            <JourneyOption 
                                icon='attach-money'
                                type='material'
                                text={this.state.journeyCost.toFixed(2).toString() + " euro"}
                            />
                            
                        </View>           
                    ) : (
                        <View>
                            <Text style={styles.logo}>Track Journey</Text>
                            <Select2
                                isSelectSingle
                                style={{ borderRadius: 5, width: '80%' }}
                                colorTheme={'#fb5b5a'}
                                popupTitle='Select vehicle'
                                title='Select vehicle'
                                data={this.state.vehiclelist}
                                onSelect={key => {
                                    this.setState({ vehiclekey: key.toString() });
                                }}
                                onRemoveItem={key => {
                                    this.setState({ vehiclekey: key.toString() });
                                }} 
                                searchPlaceHolderText='Search Vehicle'
                                cancelButtonText='Cancel'
                                selectButtonText='Choose'
                                listEmptyTitle='No vehicles to show'

                            />
                        </View>
                    )
                    )}
                </View>
                
                <View style={styles.buttonContainer}>
                {
                        !this.state.running ? (this.state.showCountdown ? (
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelPressed()}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={() => {
                                    if(this.state.vehiclekey == '') {
                                        Toast.show("Please select a vehicle first")
                                        return
                                    }
                                    requestAnimationFrame(() => this.setState({showCountdown: true}))
                                }}>
                                <Text style={styles.buttonText}>Start Journey</Text>
                            </TouchableOpacity>
                            )) : (
                                <TouchableOpacity style={styles.button} onPress={() => requestAnimationFrame(() => this.endJourney())}>
                                    <Text style={styles.buttonText}>End Journey</Text>
                                </TouchableOpacity>
                        )
                    }
                </View>                                 
            </View>
        )}
}

const stopwatchOptions = {
    container: {
        alignSelf: 'center',
        borderRadius: 5,
        width: '100%'
    },
    text: {
        fontSize: 28,
        color: 'white',
        alignSelf: 'center'
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:40
      },
      button:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent: 'center',
        marginTop:30,
        marginBottom:20,
        
      },
      buttonText: {
        color: 'white',
        fontSize: 20
      },
      buttonContainer: {
          flex: 2,
          width: '100%',
          alignItems: 'center'
      },
      contentContainer: {
          flex: 6,
          width: '100%',
          alignItems: 'center',
          marginTop: '40%'
      }
})

export default TrackJourney;

{/* <View>
    <Text>SPEED</Text>
    <Text>{this.round(speed)}</Text>

    <Text>GYROSCOPE DATA</Text>
    <Text style={styles.text}>
        x: {this.round(gyroscopeData.x)} y: {this.round(gyroscopeData.y)} z: {this.round(gyroscopeData.z)}
    </Text>
    <Text>ACCELEROMETER DATA</Text>
    <Text style={styles.text}>
        x: {this.round(accelerometerData.x)} y: {this.round(accelerometerData.y)} z: {this.round(accelerometerData.z)}
    </Text>

    <Text>DEVICEMOTION DATA</Text>
    <Text style={styles.text}>
        x: {this.round(this.state.x)} y: {this.round(this.state.y)} z: {this.round(this.state.z)}
    </Text>

    <Text>ACCELEROMETER ACCELERATION FORMULA</Text>
    <Text>{this.round(acceleration)}</Text>

    <Text>GYROSCOPE ACCELERATION FORMULA</Text>
    <Text>{this.round(gyroscope_acceleration)}</Text>

    <Text>DEVICEMOTION ACCELERATION FORMULA</Text>
    <Text>{this.round(devicemotion_acceleration)}</Text>
</View> */}