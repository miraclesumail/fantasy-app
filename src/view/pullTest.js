import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, Animated, Image, Dimensions, PanResponder} from 'react-native'

const {height, width} = Dimensions.get('window');

class PullTest extends Component {
  constructor(props){
      super(props);
      this.yOffset = new Animated.Value(0);
      this.scale = new Animated.Value(1);
      this.y = 0;
      this.shouldChange = true;
      this.scrollEnabled = true;

      this.yOffset.addListener(({value}) => {
              this.y = value;
      })

      this.translateY = this.yOffset.interpolate({
          inputRange:[0, 75, 150],
          outputRange:[0 ,0, 75 ]
      })

      this.translateZ = this.scale.interpolate({
          inputRange:[1, 2],
          outputRange:[0, 75]
      })
    //   this.scale = this.yOffset.interpolate({
    //       inputRange: [-100, 0 , 1],
    //       outputRange: [7, 1, 1]
    //   })

      this.onScroll = Animated.event([
         {nativeEvent: {contentOffset: {y: this.yOffset}}}
      ], {useNativeDriver: true})


      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => {
              return this.y == 0 && gestureState.dy > 0
            },
          onMoveShouldSetPanResponder: (evt, gestureState) => {return this.y == 0 && gestureState.dy > 0},
          onPanResponderGrant: (evt, gestureState) => {
               console.log('granted----')  
          },
        //   onPanResponderMove: Animated.event([
        //       null, { dx: this.animatedValue.x}
        //   ]),
          onPanResponderMove: (evt, gestureState) => {
              if(gestureState.dy > 100) return;
              
              this.scale.setValue(gestureState.dy/100 + 1);  
          },
          onPanResponderRelease: (evt, gestureState) => {
              console.log('release');
              this.scale.setValue(1);
          }
      })
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
       console.log(contentHeight, '-----');
  }  

  render() {
    const trs = {
        transform: [{
            translateY: this.translateY,
        }, {scale:this.scale}
        ]
    }  
    const translate = {
        transform:[{
            translateY: this.translateZ
        }]
    }
    return (
      <Animated.View style={{height}} > 
          <Animated.ScrollView onContentSizeChange={this.onContentSizeChange} scrollEnabled={this.scrollEnabled} onScroll={this.onScroll} >
               <Animated.Image
                   style={[styles.image, trs]}
                   source={require('../imgs/qq3.jpg')}
               />
               <Animated.View  style={[translate]} {...this._panResponder.panHandlers} >
                   <View style={styles.container}>
                   <Text>qqqqqqqqqq</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>wwwwwwwwww</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>eeeeeeeeee</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>ffffffffff</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>gggggggggg</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>vvvvvvvvvv</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>vvvvvvvvvv</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>vvvvvvvvvv</Text>
                    </View>
                    <View style={styles.container}>
                        <Text>vvvvvvvvvv44444ww</Text>
                    </View>
               </Animated.View>    
               
          </Animated.ScrollView>
      </Animated.View>
    )
  }
}

export default PullTest

const styles = StyleSheet.create({
    contentContainer: {
        paddingTop: 0
    },
    image: {
        width,
        height:150,
        zIndex:10
    },
    container: {
        width,
        height:120,
        backgroundColor: 'pink'
    }
})


