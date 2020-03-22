import React, { Component } from 'react';
import { 
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';

const JourneyOption = (props) => {
    const {text, icon, type} = props;
    return(
            <View style={styles.container}>
                <Icon 
                    name={icon}
                    type={type}
                    style={styles.inputIcon}
                    color="#fb5b5a"
                />
                <Text style={styles.text}>{text}</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 20,
        borderColor: 'white',
        borderBottomWidth: 1,
        width: '100%'
    },
    text: {
        fontSize: 24,
        textAlignVertical: 'bottom',
        color: 'white'
    }
}
)


export default JourneyOption;