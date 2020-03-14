//TODO analytics lines chart

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native';
import LineChart from "react-native-responsive-linechart";
import firebase from 'firebase';
import humanize from 'humanize-plus';
import Toast from 'react-native-simple-toast';

// import {
//     LineChart,
//     BarChart,
//     PieChart,
//     ProgressChart,
//     ContributionGraph,
//     StackedBarChart
//   } from 'react-native-chart-kit';

import Journey from '../components/Journey'
import { ScrollView, FlatList } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get("window").width;

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalAmount: 0,
            showJourneys: true,
            list: [],
        };
    }

    async componentDidMount(){
        const { currentUser } = firebase.auth();
        
        await firebase.database().ref(`/users/${currentUser.uid}/journeys/`).on('value', snapshot => {
            var journey_list = []
            var amount = 0
            var currentMonth = this.humanizedMonth(new Date().getMonth())
            snapshot.forEach((childSub) => {
                if(currentMonth == childSub.val().billing_month){
                    amount = amount + childSub.val().cost
                }
                journey_list.push(childSub.val())
            })

            this.setState({totalAmount: amount, list: journey_list.reverse()})
        })
    }

    // buildAnalytics(){
    //     const { currentUser } = firebase.auth();
    //     firebase.database().ref(`/users/${currentUser.uid}/journeys/`).on('value', snapshot => {
    //         snapshot.forEach((childSub) => {
    //             console.log(childSub.val())
    //         })
    //         this.setState({totalAmount: amount})
    //     })
    // }


    renderJourney(distance, cost){
        return <Journey distance={distance} cost={cost} />
    }

    humanizedMonth(month){
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
        return month
    }

    render() { 
        return(
            <View style={styles.main}>
                <View style={styles.contentContainer}>
                    <View style={styles.amount}>
                        <View>
                            <Text style={styles.amountHeader}>€{this.state.totalAmount.toFixed(2)}</Text>
                        </View>
                            
                        <View>
                            <Text>  Monthly bill</Text>
                        </View>
                    </View>
                    <View style={styles.analytics}>
                        {/* <LineChart style={{ flex: 1 }} config={config1} data={data1} /> */}
                    </View>
                </View>
                <View style={styles.journeysContainer}>
                    <Text style={styles.journeysHeader}>Past Journeys</Text>
                    <Text style={{alignSelf: 'flex-end', paddingRight: 10}}>{this.state.list.length} {humanize.pluralize(this.state.list.length, "past journey")}</Text>
                    <ScrollView>
                        <FlatList
                            data={this.state.list}
                            renderItem={({item, index}) => 
                                <Journey 
                                    style={styles.item}
                                    address={item.address}
                                    date={item.humanized_date} 
                                    distance={item.distance} 
                                    cost={item.cost}
                                    nightdrive={item.nightdrive}
                                    vehiclename={item.vehiclename}
                                />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                </View>           
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 5,
        flexDirection: 'column'
    },
    contentContainer:{
        flex: 2,
        flexDirection: 'column'
    },
    amount:{
        flex: 2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'center',
    },
    analytics:{
        // borderColor: 'black',
        // borderWidth: 1,
        flex: 2,
    },
    amountHeader:{
        paddingTop: 20,
        textAlign: 'center',
        fontSize: 35,
        textAlignVertical: 'bottom'
    },
    journeysContainer:{
        flex: 3
    },
    journeysHeader: {
        textAlign: 'center',
        fontSize: 24,
        paddingTop: 15,
        color: '#007FF3'
    }
});

export default HomeScreen;