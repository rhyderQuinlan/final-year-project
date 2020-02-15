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
import { LineChart } from "react-native-chart-kit";
import firebase from 'firebase';

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
            list: []
        };
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
    }

    componentDidMount(){
        const { currentUser } = firebase.auth();
        const list = []
        firebase.database().ref(`/users/${currentUser.uid}/journeys/`).on('value', snapshot => {
            var amount = 0
            snapshot.forEach((childSub) => {
                list.push(childSub.val())
                amount = amount + childSub.val().cost
                console.log(amount)
            })
            this.setState({totalAmount: amount, list: list})
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
        return <Journey distance={distance} cost={cost}/>
    }

    render() { 
        const journey_list = [] 
        this.state.list.forEach((element) => {
            journey_list.push(this.state.list.pop())
        })

        return(
            <View style={styles.main}>
                <View style={styles.contentContainer}>
                    <View style={styles.amount}>
                        <Text style={styles.amountHeader}>€{Math.round((this.state.totalAmount) * 100) /100}</Text>
                    </View>
                    <View style={styles.analytics}>
                        {/* <LineChart
                            data={{
                                labels: [ "January", "February", "March", "April", "May", "June" ],
                                dataset: [
                                    {
                                        data: [ 20, 45, 28, 80, 99, 43 ]
                                    }
                                ]
                            }}
                            width={screenWidth}
                            height={256}
                            verticalLabelRotation={30}
                            chartConfig={{
                                backgroundGradientFrom: "#1E2923",
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientTo: "#08130D",
                                backgroundGradientToOpacity: 0.5,
                                // color: ( opacity = 1 ) => `rgba(26, 255, 146, ${opacity})`,
                                // labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                strokeWidth: 2, // optional, default 3
                                barPercentage: 0.5,
                            }}
                            bezier
                        /> */}
                    </View>
                </View>
                <View style={styles.journeysContainer}>
                    <Text style={styles.journeysHeader}>Past Journeys</Text>
                    <ScrollView>
                        <FlatList
                            data={journey_list}
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
//<Journey distance={childSub.val().distance} cost={childSub.val().cost}/>

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
        flexDirection: 'column-reverse'
    },
    analytics:{
        borderColor: 'black',
        borderWidth: 1,
        flex: 2,
    },
    amountHeader:{
        paddingTop: 20,
        textAlign: 'center',
        fontSize: 30
    },
    journeysContainer:{
        flex: 3
    },
    journeysHeader: {
        borderTopWidth: 1,
        borderTopColor: 'black',
        textAlign: 'center',
        fontSize: 24,
        paddingTop: 15
    }
});

export default HomeScreen;