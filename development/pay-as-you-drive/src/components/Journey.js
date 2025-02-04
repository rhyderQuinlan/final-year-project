import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet
 } from 'react-native';
 import { Icon } from 'react-native-elements';

const Journey = (props) => {
    const {address, distance, cost, date, nightdrive, vehiclename} = props;
    return(
        <View style={styles.maincontainer}>
            <View style={styles.uppercontainer}>
                <View style={styles.leftContainer}>
                    <View>
                        <Text style={styles.date}>{date}</Text>
                        <Text style={{color: '#84828C'}}>{address}</Text>
                        <Text style={{color: '#84828C'}}>{vehiclename}</Text>
                    </View>                
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.cost}>€{cost.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.lowercontainer}>
                <View style={styles.icon_text_view}>
                    <Icon 
                        name='car'
                        type='antdesign'
                        color='#84828C'
                    />
                    <Text style={{color: '#84828C'}}>  {distance} Km</Text>
                </View>

                { nightdrive ? 
                    (
                    <View style={styles.icon_text_view}>
                        <Icon 
                            name='moon'
                            type='feather'
                            color='#84828C'
                        />
                        <Text style={{color: '#84828C'}}>   Night drive</Text>
                    </View>    
                    )
                    :
                    (
                    <View style={styles.icon_text_view}>
                        <Icon 
                            name='sun'
                            type='feather'
                            color='#84828C'
                        />
                        <Text style={{color: '#84828C'}}>    Day Drive  </Text>
                    </View> 
                    )
                }
            </View>

            <View style={{
                borderBottomColor: '#84828C',
                borderBottomWidth: 1,}}>

            </View>
        </View>
    )
};

const styles=StyleSheet.create({
    maincontainer: {
        flexDirection: 'column'
    },
    uppercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    lowercontainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingBottom: 15,
        width: '80%',
        alignSelf: 'center'
    },
    leftContainer:{

    },
    rightContainer:{

    },
    cost:{
        fontSize: 25,
        color: '#2E6CB5'
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#373E45'
    },

    icon_text_view: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        textAlignVertical: 'bottom',
    }
});

export default Journey;