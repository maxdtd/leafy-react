import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions
} from 'react-native';
import { Camera, Permissions } from 'expo';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Ionicons } from '@expo/vector-icons';
import { MonoText } from '../components/StyledText';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

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
        <React.Fragment>
          {/* CAMERA VIEW */}
          <View>
            <Camera style={styles.cameraPreview} type={this.state.type} ref={(ref)=>{this.camera}}/>
          </View>
          {/* INTERACTION BAR */}
          <Grid style={styles.bottomToolbar}>
            <Row>
              <Col style={styles.alignCenter}>
              {/* SPACER */}
              </Col>
              <Col size={2} style={styles.alignCenter}>
                <TouchableWithoutFeedback>
                  <View style={styles.captureBtn}>
                  </View>
                </TouchableWithoutFeedback>
              </Col>
              <Col style={styles.alignCenter}>
                <TouchableOpacity>
                  <Ionicons name="md-image" color="white" size={30} />
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
          {/* CLASSIFICATION BAR */}
          <View style={styles.classificationBar}>
            <Text style={styles.classificationBarText}>##predictions## -  ##percentage##</Text>
          </View>
        </React.Fragment>
      );
    }  
  } 
}


{/* STYLES */}
const styles = StyleSheet.create({
  cameraPreview:{
    aspectRatio: 7/9,
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  classificationBar:{
    backgroundColor: '#AAA',
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
  classificationBarText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 100,
    bottom: 60,
},
captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "#FFFFFF",
},
captureBtnActive: {
    width: 80,
    height: 80,
},
captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: "red",
    borderColor: "transparent",
},
});