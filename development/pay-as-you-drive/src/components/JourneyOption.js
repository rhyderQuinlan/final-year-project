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
                    color="#2E6CB5"
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
        borderColor: '#84828C',
        borderBottomWidth: 1,
        width: '100%'
    },
    text: {
        fontSize: 24,
        textAlignVertical: 'bottom',
        color: '#84828C'
    }
}
)


export default JourneyOption;