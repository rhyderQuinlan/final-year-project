import React from 'react';
import firebase from 'firebase';
import { View, ActivityIndicator, Image, Text} from 'react-native';
export default class AsyncImage extends React.Component {
    //The constructor for your component
    constructor(props){
        super(props)

        this.state =
        {
            loading: true,
            mounted: true,
            image: "../../assets/icon.png",
            url: "",
        }
    }

    componentDidMount() {
        this.setState({ isMounted: true })
        this.getAndLoadHttpUrl()
     }

    async getAndLoadHttpUrl() {
        if (this.state.mounted == true) {
          const ref = firebase.storage().ref(`uploads/${this.props.uid}/${this.props.id}.jpeg`);
          ref.getDownloadURL().then(data => {
             this.setState({ url: data })
             this.setState({ loading: false })
          }).catch(error => {
             this.setState({ url: "../../assets/icon.png" })
             this.setState({ loading: false })
         })
       }
     }
    
    componentWillUnmount() {
        this.setState({ isMounted: false })
    }

    componentWillReceiveProps(props) {
        this.props = props
        if (this.props.refresh == true) {

        }
    }

    render() {
        if (this.state.mounted == true) {
           if (this.state.loading == true) {
                return (
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator />
                </View>
                )
            }
            else {
                return (
                    <View>
                    <Image style={this.props.style} source={{uri: this.state.url}}/>
                    </View>
                )
            }
        }
        else {
            return null
        }
    }
}