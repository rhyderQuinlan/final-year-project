//TODO car details
//verification api

//show no charge when stationary
//flat rate
//monthly reset
//acting as verify in system    


import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    PermissionsAndroid,
    Platform,
    YellowBox,
    Picker
} from 'react-native';

import Toast from 'react-native-simple-toast';
import firebase from 'firebase';
import { CountDown } from 'react-native-countdown-component';
import { Stopwatch } from 'react-native-stopwatch-timer';
import humanize from 'humanize-plus';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import ButtonComponent from '../components/ButtonComponent';
import Select2 from 'react-native-select-two';
import _ from 'lodash';

import { Client } from "@googlemaps/google-maps-services-js"; //speed limit task
import { getSunrise, getSunset } from 'sunrise-sunset-js'; //sunrise-sunset task
import { Icon } from 'react-native-elements';
import DropdownInput from '../components/DropdownInput';

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

            vehiclelist: [],
            vehiclename: '',
            vehicletype: '',
            vehicleyear: 0,
            vehiclekey: ''
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
        
        const date_string = `${date}/${month}/${year}`
        this.journeyCreate(address, distance, duration, cost_total, date_string, humanized_string, nightdrive, vehiclename, vehiclekey);
        
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
        //driving after sunset or before sunrise multiplier
        var nightdrive_addition = 0
        if (!this.state.nightdrive) {
            nightdrive_addition = distance * db_input.nightdrive_multiplier/100
        }

        switch (this.state.vehicletype) {
            case 'SUV' || 'Pickup' || 'Minivan':
                var vehicletype_addition = distance * (db_input.heavyclass / 100)
                break;
            case 'Coupe' || 'Roadster' || 'Sedan':
                var vehicletype_addition = distance * (db_input.middleclass / 100)
                break;
            case 'Hatchback':
                var vehicletype_addition = distance * (db_input.lightclass / 100)
                break;
            default:
                break;
        }

        var vehicletype_addition = 0

        const distance_addition = distance * db_input.distance / 100

        console.log("------------------------- Algorithm ---------------------------\nDistance: " + distance + " nightdrive_multiplier: " + db_input.nightdrive_multiplier + " vehicletype_addition: " + vehicletype_addition + "\n")
        console.log(distance_addition + " + " + vehicletype_addition + " + " + nightdrive_addition + "\n---------------------------------------------------------")

        const total = distance_addition + nightdrive_addition + vehicletype_addition
        this.setState({journeyCost: total})
        return total
        //TODO refine algorithm
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

    journeyCreate(address, distance, duration, cost_total, date, humanized_date, nightdrive, vehiclename, vehiclekey){
        const data = {
            address: address,
            distance: distance,
            duration: duration,
            cost: cost_total,
            date: date,
            humanized_date: humanized_date,
            nightdrive: nightdrive,
            vehiclename: vehiclename,
            vehiclekey: vehiclekey
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

    render() {
        return(
            <View style={styles.main}>
                <View style={styles.content}>
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
                            { this.state.nightdrive ? 
                                (<JourneyOption 
                                    name='moon'
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
                            <JourneyOption 
                                icon='attach-money'
                                type='material'
                                text={this.currentTime}
                            />
                            <Stopwatch 
                                start={this.state.stopwatchStart}
                                reset={this.state.stopwatchReset}
                                options={stopwatchOptions}
                                getTime={(time) => this.getFormattedTime(time)} 
                            /> 
                        </View>           
                    ) : (
                        <View>
                            <Text style={styles.headingtext}>Track Journey</Text>
                            <Select2
                                isSelectSingle
                                style={{ borderRadius: 5, width: '80%' }}
                                colorTheme={'#007FF3'}
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

                <View style={styles.button}>
                    {
                        !this.state.running ? (this.state.showCountdown ? (
                            <ButtonComponent 
                                text="Cancel"
                                icon="cancel"
                                type="material-community"
                                onPress={() => this.cancelPressed()}
                            />
                        ) : (<ButtonComponent 
                                text="Start Journey"
                                icon="arrowright"
                                type="antdesign"
                                onPress={() => {
                                    if(this.state.vehiclekey == '') {
                                        Toast.show("Please select a vehicle first")
                                        return
                                    }
                                    requestAnimationFrame(() => this.setState({showCountdown: true}))
                                }}
                            />)) : (
                            <ButtonComponent 
                                text="End Journey"
                                icon="stop"
                                type="foundation"
                                onPress={() => requestAnimationFrame(() => this.endJourney())}
                            />
                        )
                    }
                    
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
        flex: 7,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    heading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingtext: {
        fontSize: 24,
        paddingTop: 20,
        color: '#007FF3',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: 30
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