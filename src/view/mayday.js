import React, { Component, useState, useRef } from 'react'
import { Text, View, Animated, Easing, StyleSheet, Dimensions, Button } from 'react-native'
import { State, PanGestureHandler} from 'react-native-gesture-handler'
//import Reanimated, { Transitioning, Transition } from "react-native-reanimated";
import Reanimated from "react-native-reanimated";

const { width, height } = Dimensions.get('window');
const { timing, Value } = Animated;
const { cond, eq, Value: ReValue, add, event, set, onChange } = Reanimated;

/*function Progress() {
   const transition = <Transition.Change interpolation="easeInOut" />;
   let [perc, setPerc] = useState(20);
   const ref = useRef();

   return (
       <Transitioning.View ref={ref} style={styles.centerAll} transition={transition}>
            <Button 
                 title={perc + 20 <= 100 ? '+20%' : '-80%'}
                 color="#FF5252"
                 onPress={ () => {
                       ref.current.animateNextTransition();
                       setPerc(perc + 20 <= 100 ? perc + 20 : 20);
                   }
                 }
            />
            <View style={styles.bar}>
                <View
                style={{ height: 5, width: `${perc}%`, backgroundColor: '#FF5252' }}
                />
            </View>
       </Transitioning.View>
   )
}*/

/*function Sequence() {
    const transition = (
        <Transition.Sequence>
            <Transition.Out type="scale" durationMs={2000}/>
            <Transition.Change interpolation="easeInOut" />
            <Transition.In type="fade" durationMs={1000}/>
        </Transition.Sequence>
    )

    let [showText, setShowText] = useState(true);
    const ref = useRef();

    return (
        <Transitioning.View  transition={transition} style={styles.centerAll} ref={ref}>
            <Button
                title="show or hide"
                color="#FF5252"
                onPress={() => {
                    ref.current.animateNextTransition();
                    setShowText(!showText);
                }}
            />
            {showText && (
                <Text style={styles.text}>Tap the above button to hide me</Text>
            )}
        </Transitioning.View>
    )
}*/

class May extends Component {
  constructor(props){
      super(props);
      this._animatedValue = new Value(0);

      this._left = this._animatedValue.interpolate({
           inputRange: [10, 30],
           outputRange: [30, 150],
           extrapolate: "clamp"
      })

      this.dragX = new ReValue(0);
      this.dragY = new ReValue(0);
      this.offsetX = new ReValue(width / 2);
      this.offsetY = new ReValue(100);
      this.gestureState = new ReValue(-1);

      
      const addX = add(this.dragX, this.offsetX);
      const addY = add(this.dragY, this.offsetY);

      this.onGestureEvent = event([{
           nativeEvent: {
               translationX: this.dragX,
               translationY: this.dragY,
               state: this.gestureState
           }
      }])

      this.transX = cond(eq(this.gestureState, State.ACTIVE), addX, set(this.offsetX, addX));
      this.transY = cond(eq(this.gestureState, State.ACTIVE), addY, set(this.offsetY, addY));
  }

  componentDidMount() {
      timing(this._animatedValue, {
           toValue: 50,
           duration: 5*1000,
           easing: Easing.linear
      }).start();
  }

  render() {
    const left = {
          left: this._left
    }  

    const transform = [
            {
               translateX: this.transX,
            },
            {
               translateY: this.transY
            }
    ]
    return (
      <View>
        <Animated.View style={[styles.box, left]}>
            <Text> textInComponent </Text>
        </Animated.View>  

        <PanGestureHandler maxPointers={1} onGestureEvent= {this.onGestureEvent} onHandlerStateChange = {this.onGestureEvent}>
            <Reanimated.View style={[styles.circle, transform]}>
            </Reanimated.View>
        </PanGestureHandler>

      </View>
    )
  }
}

export default May

const styles = StyleSheet.create({
      box: {
          width: 50,
          height: 50,
          backgroundColor: 'pink'
      },
      circle: {
          width:60,
          height:60,
          borderRadius: 60,
          backgroundColor: 'yellowgreen'
      },
      centerAll: {
         alignItems: 'center',
         marginTop: 100
      },
      bar: {
        marginTop: 30,
        height: 5,
        width: '80%',
        backgroundColor: '#aaa',
      },
      text: {
        fontSize: 16,
        margin: 10,
      }
})
