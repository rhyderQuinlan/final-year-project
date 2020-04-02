import React, { Component } from 'react';
import { 
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

const AlgorithmInput = (props) => {
    const {text, placeholder, onChangeText, measurement, ref, onSubmitEditing} = props;
    return(
            <View style={styles.container}>
                <Text style={styles.text}>{text}: </Text>
                <TextInput
                    ref={ref}
                    placeholder={placeholder}
                    underlineColorAndroid='transparent'
                    onChangeText={onChangeText}
                    style={styles.input}
                    />
                <Text style={styles.measurement}> {measurement}</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        width: '90%',
        alignSelf: 'center'
    },
    text: {
        fontSize: 16,
        textAlignVertical: 'bottom',
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#EFC066',
        fontSize: 16,
        textAlign: 'center',
    },
    measurement:{
        textAlignVertical: 'bottom',
        fontSize: 16
    }
}
)


export default AlgorithmInput;