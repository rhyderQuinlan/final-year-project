//TODO analytics lines chart
//TODO show list of past journeys

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    SectionList
} from 'react-native';
import LineChart from "react-native-responsive-linechart";
import firebase from 'firebase';
import humanize from 'humanize-plus';

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
import { element } from 'prop-types';

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

    componentDidMount(){
        const { currentUser } = firebase.auth();
        
        var list = []

        if(this.state.list > 0){
            console.log("clearing list")
            this.state.list.forEach((element) => {
                this.state.list.pop()
            })
        }
        
        firebase.database().ref(`/users/${currentUser.uid}/journeys/`).on('value', snapshot => {
            var amount = 0
            snapshot.forEach((childSub) => {
                list.push(childSub.val())
                amount = amount + childSub.val().cost
            })
            this.setState({totalAmount: amount, list: list.reverse()})
        })

        console.log("List: " + list)
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
        return <Journey distance={distance} cost={cost}/>
    }

    render() { 
        return(
            <View style={styles.main}>
                <View style={styles.contentContainer}>
                    <View style={styles.amount}>
                        <View>
                            <Text style={styles.amountHeader}>€{Math.round((this.state.totalAmount) * 100) /100}</Text>
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
                            renderItem={({item}) => 
                                <Journey 
                                    style={styles.item}
                                    date={item.humanized_date} 
                                    distance={item.distance} 
                                    cost={item.cost}
                                />}
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
        borderColor: 'black',
        borderWidth: 1,
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
        color: '#191BAF'
    }
});

export default HomeScreen;