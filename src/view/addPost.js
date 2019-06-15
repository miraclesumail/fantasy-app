import React, { Component } from "react";
import { Text, View, TouchableWithoutFeedback, Image, TextInput, Dimensions, ScrollView } from "react-native";
// import ImagePicker from 'react-native-customized-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from 'react-redux';

const { width, height } = Dimensions.get("window");

class AddPost extends Component {
  state = {
    imgs: [],
    comment:''
  };

  showImage = () => {
    ImagePicker.openPicker({
      multiple: true
    }).then(images => {
      this.setState({ imgs: [...this.state.imgs, ...images.map(img => ({ uri: img.path }))]});
    });
  };

  addPost = () => {
       this.props.addPost({
           name: "being Ray",
           content: this.state.comment,
           time: "刚刚",
           avatar: require("../imgs/qq2.jpg"),
           imgs: this.state.imgs     
       }).then((qq) => {console.log(qq, 'wnfbwpfwowo你不吃皮我单位皮肤');
        setTimeout(() => {
            this.props.navigation.push('Friends')
        }, 100);
        
  })}

  render() {
    return (
      <View style={{width, height, paddingHorizontal: .05*width}}>
        <View style={{width:.9*width, height:30, flexDirection:'row', justifyContent: "space-between"}}>
             <TouchableWithoutFeedback onPress={this.showImage}>
                <View style={{ width: 100, height: 30, backgroundColor: "yellow" }}>
                    <Text>选择照片</Text>
                </View>
             </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => this.addPost()}>
                <View style={{ width: 100, height: 30, backgroundColor: "yellow" }}>
                    <Text>发表</Text>
                </View>
            </TouchableWithoutFeedback>
            
        </View>  
      <View style={{width:.9*width, height:80, marginVertical:10}}>
            <ScrollView style={{width: .9*width}}>
                    <TextInput
                        onChangeText={text => {console.log(text);this.setState({ comment: text })}}
                        autoFocus={true}
                        multiline={true}
                        placeholder={"你想说点什么"}
                        placeholderTextColor={"#c3c3c3"}
                        style={{
                            backgroundColor: "#ffffff",
                            lineHeight: 18
                        }}
                        />
            </ScrollView>
      </View>

      <View style={{width:.9*width, flexDirection:'row', flexWrap:'wrap'}}>
            {this.state.imgs.length ? (
                this.state.imgs.map((image,index) => (
                    (index+1) % 3 ? <Image style={{ width: .28*width, height: .36*width, marginRight: .028*width, marginBottom:.03*width}} source={image} />
                    : <Image style={{ width: .28*width, height: .36*width, marginBottom:.028*width}} source={image}/>
                ))
                ) : null}

            {
            (this.state.imgs.length + 1) % 3 ? <TouchableWithoutFeedback onPress={this.showImage}>
                    <View style={{width: .28*width, backgroundColor:'pink', height: .36*width, marginRight: .028*width, marginBottom:.03*width, justifyContent:'center', alignItems:'center'}}>
                        <Text>+</Text>
                    </View>   
                </TouchableWithoutFeedback>
                : <TouchableWithoutFeedback onPress={this.showImage}>
                    <View style={{width: .28*width, height: .36*width, marginBottom:.028*width, backgroundColor:'pink',justifyContent:'center', alignItems:'center'}}>
                     <Text>+</Text>
                    </View> 
                  </TouchableWithoutFeedback>     
            }
      </View>

        
      </View>
    );
  }
}

function mapStateToProps (state) {
  return {
     gamesList: state.people.gamesList,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addPost: (post) => {return Promise.resolve('qq').then(() => dispatch({type: 'addPost', post}))}, 
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPost)
