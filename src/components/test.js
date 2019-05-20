/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TextInput, ScrollView, Animated} from 'react-native';

export default class Test extends Component{
  constructor(props) {
      super(props);
      this.state = {
          show:false
      }
        this.animatedOpacity = new Animated.Value(0);
        this.animatedOpacity.addListener((callback) => {
             console.log(callback.value);             
        })
  }

  scroll(event) {
            //console.log(event.nativeEvent)
            if(event.nativeEvent.contentOffset.y > 200 && !this.state.show){
                     Animated.timing(this.animatedOpacity,{
                        toValue:1,
                        duration:800
                     }).start()
                     this.setState({show:true})
            }else if(event.nativeEvent.contentOffset.y <= 200 && this.state.show){
                        this.setState({show:false})
                        Animated.timing(this.animatedOpacity,{
                            toValue:0,
                            duration:800
                        }).start()                        
            }
  }

  render() {
    const viewStyle = {position:'absolute', left:100, height:100, 
    width:100, top:20, backgroundColor:'yellow', zIndex:10}  
    const opacity = {opacity: this.animatedOpacity}
    return (
    <View style={{height:500}}>
    <Animated.View style={[viewStyle, opacity]} 
        onLayout={({nativeEvent: { layout: {x, y, width, height}}}) => {
            console.log(x,y,width,height)
        }}/> 
   

     <ScrollView style={{ backgroundColor:'orange'}} contentContainerStyle={{alignItems: 'center'}}
        onScroll={this.scroll.bind(this)} 
      >
          <TextInput  style={{height: 400, width:200, borderColor: 'gray', borderWidth: 1, backgroundColor:'green'}}
           editable = {true}
           multiline = {true}
           placeholder={'ddddd'}
           selectionColor={'red'}

           onEndEditing = {() => {
           }}
           onSelectionChange = {(e) => {
                //alert(JSON.stringify(e.nativeEvent.selection))
           }}
          />
           <TextInput  style={{height: 700, width:200, borderColor: 'gray', borderWidth: 1, backgroundColor:'green'}}
           editable = {true}
           multiline = {true}
           placeholder={'ddddd'}
           onEndEditing = {() => {
               alert('eeeee')
           }}
           onSelectionChange = {(e) => {
                //alert(JSON.stringify(e.nativeEvent.selection))
           }}
          />
      </ScrollView>    
    </View>  
    ); 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
