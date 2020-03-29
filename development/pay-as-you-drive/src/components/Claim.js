import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet
 } from 'react-native';
 import { Icon } from 'react-native-elements';

const Claim = (props) => {
    const {date, status, id, outcome, amount} = props;
    return(
        <View style={styles.maincontainer}>
            <View style={styles.uppercontainer}>
                <View style={styles.leftContainer}>
                    <View>
                        <Text style={styles.date}>{date}</Text>
                        { amount !== null ? (
                            <Text style={{color: '#84828C'}}>€ {amount}</Text>
                        ) : (null) }
                        <Text style={{color: '#84828C'}}>{id}</Text>
                    </View>                
                </View>
                <View style={styles.rightContainer}>
                    { status !== null ? (
                        !status ? (
                                <Text style={styles.cost}>Pending</Text>
                            ) : (
                                <Text style={styles.cost}>{outcome}</Text>
                                )
                    ) : (
                        <Icon 
                            name='right'
                            type='antdesign'
                        />
                    )}
                    
                </View>
            </View>
            <View style={styles.lowercontainer}>
                
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
        fontSize: 25,
        color: '#2E6CB5'
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold'
    },

    icon_text_view: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        textAlignVertical: 'bottom',
    }
});

export default Claim;