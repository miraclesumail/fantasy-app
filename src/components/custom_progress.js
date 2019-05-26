import React, { Component } from 'react'
import { Text, View, Animated, StyleSheet, PanResponder } from 'react-native'

// 小数向下取
function pointsDown(num, n){
    var m = Math.pow(10,n);
    return Math.floor(num*m)/m;
}

// 0.1 + 0.2 = 0.30000000004
function add(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
}

class CustomProgress extends Component {
  static defaultProps = {
         width: 200,
         height: 40,
         backgroundColor: 'pink',
         min: 10,
         max: 100
  }

  animatedWidth = new Animated.Value(this.props.height/2);

  score = this.props.min;

  render() {
    const {width, height, backgroundColor, borderRadius = height/2, min, max, setMinVal } = this.props;
    const styleprops = {width, height, backgroundColor, borderRadius};
    const progressStyle = {borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius, height, backgroundColor:'yellow'}
    const maxProgress = width - height;
    return (
      <View style={styleprops}>
           <Animated.View style={[progressStyle, {width: this.animatedWidth}]}></Animated.View>
           {
               setMinVal ? 
               <DragBox width={height} max={maxProgress} range={[min, max]} setWidth = {(width) => this.animatedWidth.setValue(width)}
               setMinVal={(minVal) => setMinVal(minVal)} setScore={(score) => this.score = score}/> : 
               <DragBox width={height} max={maxProgress} setScore={(score) => this.score = score} range={[min, max]} setWidth = {(width) => this.animatedWidth.setValue(width)}/>
           }       
      </View>
    )
  }
}

class DragBox extends Component {
      static defaultProps = {
             min: 0,
             max: 100,
             width: 40
      }

      constructor(props){
            super(props);
            this.state = {
                 text: props.range[0]
            }

            this.animatedValue = new Animated.Value(0);
            this._value = 0;

            this.animatedValue.addListener(({value}) => {
                const {min, max, width, range} = this.props;
                if(value > max ){
                    this.animatedValue.setOffset(0);
                    this.animatedValue.setValue(max);
                    return;
                }
                if(value < min ){
                    this.animatedValue.setOffset(0);
                    this.animatedValue.setValue(min);
                    return;
                }
                this._value = value;
                const gap = pointsDown((range[1] - range[0])*value/(max - min), 1);
                let text = add(range[0], gap);
                this.setState({text})
                this.props.setWidth(value + width/2);
            })

            this.panResponder = PanResponder.create({
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => {
                    const {min, max} = this.props;
                    if((gestureState.vx > 0 && this._value >= max) || (gestureState.vx < 0 && this._value <= min)) {
                        return false;             
                    }
                    return true;   
                },
                onPanResponderGrant: (evt, gestureState) => {
                    this.animatedValue.setOffset(this._value);
                    this.animatedValue.setValue(0);
                },
                onPanResponderMove: (evt, gestureState) => {
                    const {min, max} = this.props;
                    if((gestureState.vx > 0 && this._value >= max) || (gestureState.vx < 0 && this._value <= min)) {
                        return;             
                    }
                    Animated.event([null, { dx: this.animatedValue}])(evt, gestureState);
                },  
                onPanResponderRelease: (evt, gestureState) => {
                    console.log("release");
                    console.log(this._value);
                    this.props.setMinVal && this.props.setMinVal(this.state.text);
                    this.props.setScore(this.state.text);
                    this.animatedValue.flattenOffset();
                }
            });
      }  

      componentWillReceiveProps(nextProps){
          if(!this.props.range || (this.props.range[0] != nextProps.range[0])){
              const {min, max, width, range} = nextProps;
              const gap = pointsDown((range[1] - range[0])*this._value/(max - min), 1);
              const text = add(nextProps.range[0], gap);
              this.setState({text});
              this.props.setScore(this.state.text);
          }
      }   
     
      render() {
          const transformStyle = {
                transform: [
                    {translateX: this.animatedValue}
                ]
          }
          const { width } = this.props;
          const styleprops = {width, height: width, borderRadius: width/2}
          return (
              <Animated.View style={[styles.box, styleprops,transformStyle]} {...this.panResponder.panHandlers}>
                     <Text>{this.state.text}</Text>
              </Animated.View>
          )
      }
}

export default CustomProgress

const styles = StyleSheet.create({
     box: {
        position:'absolute',
        left:0,
        top:0,
        backgroundColor:'yellowgreen',
        justifyContent: 'center',
        alignItems: 'center'
     }
})
