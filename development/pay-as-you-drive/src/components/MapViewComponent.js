import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  MapView,
  Dimensions,
  StatusBarIOS
} from 'react-native'

const { width, height } = Dimensions.get('window')

class MapViewComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          mapType='satellite'
          showsUserLocation={true}
          followUserLocation={true}
        />
        <View style={styles.navBar}><Text style={styles.navBarText}>Run Rabbit Run</Text></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        
    },
    map: {
        width: 400,
        height: 400
    },
    navBar: {

    },
    navBarText: {
        
    }
})

AppRegistry.registerComponent('MapViewComponent', () => MapViewComponent)