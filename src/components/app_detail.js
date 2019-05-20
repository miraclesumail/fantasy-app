/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image} from 'react-native';
import { connect } from 'react-redux'
//图片选择器
var ImagePicker = require('react-native-image-picker');

//图片选择器参数设置
var options = {
  title: '请选择图片来源',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'相册图片',
  customButtons: [
    {name: 'hangge', title: 'hangge.com图片'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class MovieDetail extends Component{
  // static navigationOptions = ({navigation, navigationOptions}) => {
  //      return {
  //           title: '爱洗涤' + JSON.stringify(navigationOptions)
  //      }
  // }

  constructor(props) {
      super(props);
      this.state = {
          avatarSource: null
      };
  }

  choosePic() {
      ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
 
      if (response.didCancel) {
        console.log('用户取消了选择！');
      }
      else if (response.error) {
        alert("ImagePicker发生错误：" + response.error);
      }
      else if (response.customButton) {
        alert("自定义按钮点击：" + response.customButton);
      }
      else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source
        });
      }
    });
  }  
 
  

  render() {
    //const { people, isFetching } = this.props.people;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>this is AppDetail</Text>
        <Text style={styles.item} onPress={this.choosePic.bind(this)}>选择照片</Text>
        <Image source={this.state.avatarSource} style={styles.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  item:{
    margin:15,
    height:30,
    borderWidth:1,
    padding:6,
    borderColor:'#ddd',
    textAlign:'center'
  },
  image:{
   height:198,
   width:300,
   alignSelf:'center',
  }
});
