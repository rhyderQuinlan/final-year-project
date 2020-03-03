import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet
 } from 'react-native';
 import { Icon } from 'react-native-elements';

const Journey = (props) => {
    const {distance, cost, date, safeTime} = props;
    return(
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.date}>{date}</Text>
                <Text>{distance} Km</Text>
                { safeTime ? 
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
            <View style={styles.rightContainer}>
                <Text style={styles.cost}>€{cost}</Text>
            </View>
        </View>
    )
};

const styles=StyleSheet.create({
    container: {
        borderBottomColor: '#8D99AE',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30
    },
    leftContainer:{

    },
    rightContainer:{

    },
    cost:{
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default Journey;