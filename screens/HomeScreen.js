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
  Image
} from 'react-native';
import { Camera, Permissions, ImagePicker, ImageManipulator } from 'expo';
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
    classification : "READY FOR CAPTURING!",
    photo: null
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
      this.setState({classification: 'CAPTURING PICTURE!'});
      //let pic = await this.camera.takePictureAsync(0.5, false, false);
      let photo_uri = "";
      await this.camera.takePictureAsync({
        quality: 0.1 }).then((data) => {
          photo_uri = data.uri;
        });
      this.setState({classification: 'WAITING FOR SERVER RESPONSE!'});
      let formData = new FormData();
      formData.append('photo', {uri: photo_uri, name: "img.jpg", type: "image/jpeg"});
      await fetch("http://lamp.wlan.hwr-berlin.de:3456/upload", {
        method: "POST",
        body: formData,
        header: {
          'contentType': 'multipart/form-data',
        },
      }).then((response) => {
        response.json().then((data) => {
          var resp_data = String(data.result[0].className).toUpperCase() + ' - ' + String(data.result[0].probability * 100) + '%';
          this.setState({classification: resp_data});
        })
      })
    } else { 
    }
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (result.cancelled) {
      return;
    }
    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    let filetype = "image/jpeg";
    let formData = new FormData();
    formData.append('photo', {uri: localUri, name: filename, type: filetype});
    console.log(formData);
    await fetch("http://lamp.wlan.hwr-berlin.de:3456/upload", {
      method: "POST",
      body: formData,
      header: {
        'contentType': 'multipart/form-data',
      },
    });
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
          <Grid style={styles.topContainer}>
            <Row>
              <Col>
                <Image source={require('../assets/images/leafylogo.png')} style={{width: 80, height: 80}}/>
              </Col>
              <Col style={styles.alignCenter}>
                <Text style={{fontSize: 30}}>Leafy</Text>
              </Col>
              <Col style={styles.alignCenter}>
              </Col>
            </Row>
          </Grid>
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
                <TouchableOpacity onPress={this.pickImage}>
                  <Ionicons name={Platform.OS === 'ios' ? 'ios-share' : 'md-image'} color="white" size={30} />
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
    height: winWidth*1.33,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: winHeight*0.04 + 100,
  },
  topContainer: {
    height: 100,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: winHeight*0.04,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  topText:{
    fontSize: 30,
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
    //backgroundColor: '#555555',
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