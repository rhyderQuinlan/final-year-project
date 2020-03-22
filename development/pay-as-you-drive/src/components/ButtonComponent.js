import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const ButtonComponent = (props) => {
    const {text, icon, type, onPress} = props;
    return(
        <View>
            <TouchableOpacity 
                style={styles.button}
                onPress={onPress}
            >
                <Text style={styles.text}>{text}</Text>
                <Icon 
                    name={icon}
                    type={type}
                    style={{marginRight: 10}}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    )
};

const styles=StyleSheet.create({
    button:{
        alignSelf: 'center',
        alignContent: 'center',
        width: 250,
        backgroundColor: '#fb5b5a',
        borderRadius: 400,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '5%',
    },
    text: {
        fontSize: 20,
        marginLeft: 20,
        color: 'white',
        fontWeight: 'normal'
    },
});

export default ButtonComponent;