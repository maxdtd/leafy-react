import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import { Camera, Permissions } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  
  camera = null;

  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text>No permission to use camera!</Text>
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.cameraContainer} >
            <Camera style={{ flex: 1, aspectRatio: 7/9 }} type={this.state.type} ref={(ref)=>{this.camera}}>
              <View
                style={{
                  flex:1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
              </View>
            </Camera>
          </View>
          {/* Bottom Label */}
          <View style={styles.tabBarInfoContainer}>
            <Text style={styles.tabBarInfoText}>Dandelion -  97,5%</Text>
          </View>
        </View>
      );
    }  
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
  },
  cameraContainer:{
    flex: 1,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
});
