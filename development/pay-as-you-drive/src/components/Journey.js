import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet
 } from 'react-native';
 import { Icon } from 'react-native-elements';

const Journey = (props) => {
    const {address, distance, cost, date, safeTime} = props;
    return(
        <View style={styles.maincontainer}>
            <View style={styles.uppercontainer}>
                <View style={styles.leftContainer}>
                    <View>
                        <Text style={styles.date}>{date}</Text>
                        <Text style={{color: '#84828C'}}>{address}</Text>
                    </View>                
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.cost}>€{cost}</Text>
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

                { safeTime ? 
                    (
                    <View style={styles.icon_text_view}>
                        <Icon 
                            name='eye'
                            type='feather'
                            color='#84828C'
                        />
                        <Text style={{color: '#84828C'}}>   Good Visibility</Text>
                    </View>    
                    )
                    :
                    (
                    <View style={styles.icon_text_view}>
                        <Icon 
                            name='eye-off'
                            type='feather'
                            color='#84828C'
                        />
                        <Text style={{color: '#84828C'}}>   Poor Visibility</Text>
                    </View> 
                    )
                }
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
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 15,
        paddingTop: 15
    },
    lowercontainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around',
        borderBottomColor: '#84828C',
        borderBottomWidth: 1,
        paddingBottom: 15,
    },
    leftContainer:{

    },
    rightContainer:{

    },
    cost:{
        fontSize: 20,
        color: '#007FF3'
    },
    date: {
        fontSize: 16,
    },

    icon_text_view: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        textAlignVertical: 'bottom',
    }
});

export default Journey;