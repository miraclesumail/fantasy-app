import React, { Component } from 'react'
import { Text, View, ViewPagerAndroid, StyleSheet, TouchableWithoutFeedback, PanResponder, Animated} from 'react-native'

class PageOne extends Component {
  constructor(props) {
      super(props);
      this.animatedValue = new Animated.ValueXY;
      
      this._value = {x:0, y:0}
      this.animatedValue.addListener((value) => {
           this._value = value;
      })
      
      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => {
               this.animatedValue.setOffset({
                   x: this._value.x,
                   y: this._value.y
               })
               this.animatedValue.setValue({
                  x: 0,
                  y: 0
               })            
          },
          onPanResponderMove: Animated.event([
              null, { dx: this.animatedValue.x, dy: this.animatedValue.y}
          ]),
          onPanResponderRelease: (evt, gestureState) => {
              console.log('release');
              console.log(gestureState.vx);
              //this.animatedValue.flattenOffset()
          }
      })
  }


  onPageScroll = (event) => {
       //console.log(event.nativeEvent.offset)
  }

  onPageScrollStateChanged = (event) => {
       //console.log(event)
  }

  // 手动滑动是促发
  onPageSelected = (event) => {
       console.log(event.nativeEvent.position)
  }

  changePage = (page) => {
       this._scrollView.setPage(page)
  }

  render() { 
    const transformStyle = this.animatedValue.getTranslateTransform()
    return (
      <View style={styles.container}>
          <View style={{flex:1}}>
                <TouchableWithoutFeedback onPress={() => {this.changePage(1)}}>
                    <View>
                        <Text>go to page 1</Text>
                    </View>
                </TouchableWithoutFeedback>
          </View>
          <Animated.View style={[styles.box, transformStyle]} {...this._panResponder.panHandlers}>
          </Animated.View>
          <ViewPagerAndroid style={{width:'100%',flex:4}} ref={(scrollView) => { this._scrollView = scrollView }}
            onPageSelected={this.onPageSelected} onPageScroll={this.onPageScroll} onPageScrollStateChanged={this.onPageScrollStateChanged}>
                <View style={styles.pageStyle} key="1">
                    <Text>First page</Text>
                </View>
                <View style={styles.pageStyle} key="2">
                    <Text>Second page</Text>
                </View>  
                <View style={styles.pageStyle} key="3">
                    <Text>Third page</Text>
                </View> 
          </ViewPagerAndroid>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5d300',
  },
  pageStyle: {
    alignItems: 'center',
    padding: 80,
    backgroundColor: 'pink',
  },
  box: {
    position: 'absolute',
    top:100,
    left:100,
    width:100,
    height:100,
    backgroundColor: 'yellowgreen',
    zIndex:10
  }
});

export default PageOne