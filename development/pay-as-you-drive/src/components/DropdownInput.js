import React, { Component } from 'react';
import { 
    View,
    StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

const DropdownInput = (props) => {
    const {icon, label, data, type, onChangeText} = props;
    return(
        <View style={styles.inputContainer}>
            <Icon 
                name={icon}
                type={type}
                style={styles.icon}
                color="#007FF3"
            />
            <Dropdown 
                label={label}
                data={data}
                containerStyle={styles.dropdown}
                onChangeText={onChangeText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        borderBottomColor: '#FFD559',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 2,
        width:'90%',
        height:55,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center',
        paddingLeft: 10
    },
    icon:{
        width:100,
        height:100
    },
    dropdown:{
        height: 25,
        marginLeft: 10,
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: 10,
      },
}
)


export default DropdownInput;