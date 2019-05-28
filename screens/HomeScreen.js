import React from 'react';
import NavigationEvents from 'react-navigation';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import { Camera, Permissions, ImagePicker, FileSystem } from 'expo';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Ionicons } from '@expo/vector-icons';
//import { MonoText } from '../components/StyledText';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default class HomeScreen extends React.Component {

  
  camera = null;

  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    classification : "Dandelion - 95%"
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    const { navigation } = this.props;
    navigation.addListener('didFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('didBlur', () =>
      this.setState({ focusedScreen: false })
    ); 
  }
  
  takePicture = async () => {
    if (this.camera) {
      this.setState({classification: 'TAKING PICTURE!'});
      let pic = await this.camera.takePictureAsync(0.5, false, false);
      this.setState({classification: 'SAVING PICTURE!'});
      var fileName = FileSystem.documentDirectory + this.getTimestamp() + '.jpg';
      await FileSystem.copyAsync(pic.uri,fileName);
      // process image here
      // upload image here
      this.setState({classification: 'WAITING FOR SERVER RESPONSE!'});
    } else { 
    }
  }

  getTimestamp = () => {
    var date = String(new Date().getDate());
    var month =  String(new Date().getMonth() + 1); //Current Month
    var year =  String(new Date().getFullYear()); //Current Year
    var hours =  String(new Date().getHours()); //Current Hours
    var min =  String(new Date().getMinutes()); //Current Minutes
    var sec =  String(new Date().getSeconds()); //Current Seconds
    var res = year + month + date + hours + min + sec;
    return res;
  }

  // HOME SCREEN VISUALS
  render() {
    const { hasCameraPermission, focusedScreen } = this.state;
    if (hasCameraPermission === null || !focusedScreen) {
      return <View/>;
    } else if (hasCameraPermission === false && focusedScreen) {
      return <Text>No permission to use camera!</Text>
    } else if (hasCameraPermission && focusedScreen) {
      return (
        <React.Fragment>
          {/* CAMERA VIEW */}
          <View>
            <Camera style={styles.cameraPreview} type={this.state.type} ref={ref => { this.camera = ref; }}/>
          </View>
          {/* INTERACTION BAR */}
          <Grid style={styles.bottomToolbar}>
            <Row>
              <Col style={styles.alignCenter}>
              {/* SPACER */}
              </Col>
              {/* CAPTURE BUTTON*/}
              <Col size={2} style={styles.alignCenter}>
                <TouchableWithoutFeedback onPress={this.takePicture}>
                  <View style={styles.captureBtn}>
                  </View>
                </TouchableWithoutFeedback>
              </Col>
              {/* GALLERY BUTTON */}
              <Col style={styles.alignCenter}>
                <TouchableOpacity>
                  <Ionicons name="md-image" color="white" size={30} />
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
          {/* CLASSIFICATION BAR */}
          <View style={styles.classificationBar}>
            <Text style={styles.classificationBarText}> {this.state.classification} </Text>
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