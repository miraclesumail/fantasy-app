import React, { Component } from 'react'
import { Text, View, Dimensions, Animated } from 'react-native'
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

class PanPin extends Component {
  constructor(props) {
       super(props);

       this._translateX = new Animated.Value(0);
       this._translateY = new Animated.Value(0);
       this._lastOffset = { x: 0, y: 0 };

       this._baseScale = new Animated.Value(1);
       this._pinchScale = new Animated.Value(1);

       this._scale = Animated.multiply(this._baseScale, this._pinchScale);
       this._lastScale = 1;

       this._onPinchGestureEvent = Animated.event(
            [{ nativeEvent: { scale: this._pinchScale } }],
            { useNativeDriver: true }
       );

       this._onGestureEvent = Animated.event(
        [
            {
            nativeEvent: {
                translationX: this._translateX,
                translationY: this._translateY,
            },
            },
        ],
        { useNativeDriver: true }
        )
  } 
   
  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  }

  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  }

  render() {
    const transformStyle = {
            transform: [
                { translateX: this._translateX },
                { translateY: this._translateY },
                { scale: this._scale }
            ]     
    }  

    const transformStyle1 = {
            transform: [
                { scale: this._scale }
            ]     
    }  

    return (
      <View style={{width, height, justifyContent:'center', alignItems:'center'}}>
         <PanGestureHandler
                 onGestureEvent={this._onGestureEvent}
                 onHandlerStateChange={this._onHandlerStateChange}
                >
                    <Animated.View style={{width:200, height:200,justifyContent:'center', alignItems:'center', backgroundColor:'yellow'}}>
                        <PinchGestureHandler 
                            onGestureEvent={this._onPinchGestureEvent}
                            onHandlerStateChange={this._onPinchHandlerStateChange}
                        >
                           <Animated.View style={{width:200, height:200, backgroundColor:'green', ...transformStyle}}>
                                  
                           </Animated.View>
                        </PinchGestureHandler>
                    </Animated.View>          
        </PanGestureHandler>  
      </View>
    )
  }
}

export default PanPin
