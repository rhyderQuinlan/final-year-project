import React, { Component } from 'react';
import { 
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';

const JourneyOption = (props) => {
    const {text, icon, type, addition, mileage} = props;
    return(
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Icon 
                        name={icon}
                        type={type}
                        style={styles.inputIcon}
                        color="#2E6CB5"
                    />
                </View>
                
                <View style={{flex: 4}}>
                    <Text style={styles.text}>{text}</Text>
                </View>

                { mileage ? (
                    <View style={{flex: 2}}>
                        <Text style={styles.text}>{addition} cents/km</Text>
                    </View>
                    ) : addition !== null ? (
                    <View style={{flex: 2}}>
                        <Text style={styles.text}>+ {addition}%</Text>
                    </View>
                    ) : (
                    <View style={{flex: 2}}>

                    </View>
                    )
                    }
                
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: '5%',
        borderColor: '#84828C',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18,
        color: '#84828C'
    }
}
)


export default JourneyOption;