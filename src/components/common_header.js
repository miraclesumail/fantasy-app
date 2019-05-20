import React, {Component, Fragment} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Button, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Animated, Easing} from 'react-native';
import Interactable from 'react-native-interactable';

const widths = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const {Value, timing} = Animated;
const SideMenuWidth = 200;
const RemainingWidth = widths - SideMenuWidth;

class CustomHeader extends Component{
 
  constructor(props) {
    super(props);
    this.state = { 
        profiles:['qqqq', 'wwww', 'eeeee']
    };

    this._animatedValue = new Animated.Value(1);  

    this.animatedTop = new Animated.Value(0);

    this.rotate = new Animated.Value(0);
    
    this.rotateAngle = [-45, 45, -40, 40, -32, 32, -24, 24, -14, 14, 0];
    this.index = 0;

    this.angle = this.rotate.interpolate({
        inputRange: [-45, -40, -32, -24, -14, 0, 14, 24, 32, 40, 45],
        outputRange: ['-45deg', '-40deg', '-32deg', '-24deg', '-14deg', '0deg', '14deg', '24deg', '32deg', '40deg', '45deg'],
        extrapolate:'clamp'
    })

    this.animated1 = this.animatedTop.interpolate({
        inputRange:[0,10],
        outputRange:[-50, 0],
        extrapolate:'clamp'
    })
 
    this.animated2 = this.animatedTop.interpolate({
        inputRange:[0,10,20],
        outputRange:[-50,-50, 0],
        extrapolate:'clamp'
    })

    this.animated3 = this.animatedTop.interpolate({
        inputRange:[0,10,20,30],
        outputRange:[-50,-50,-50,0],
        extrapolate:'clamp'
    })

    this.animated4 = this.animatedTop.interpolate({
        inputRange:[0,10,20,30,40],
        outputRange:[-50,-50,-50,-50,0],
        extrapolate:'clamp'
    })

    this.scale1 = this._animatedValue.interpolate({
        inputRange:[1, 4],
        outputRange:[1, 2.75],
        extrapolate:'clamp'
    })

    this.scale2 = this._animatedValue.interpolate({
        inputRange:[1, 4],
        outputRange:[1, 1.5],
        extrapolate:'clamp'
    })

  }

  componentDidMount() {
    //this.beginScale();
    timing(this.animatedTop, {
        toValue:40,
        duration:800,
        easing:Easing.bezier(0.65, 0.28, 0.74, 0.06)
    }).start(() => {
        this.rotateView();
    });     
  }

  rotateView = () => {
    const index = this.index;
    if(index == 11) return;  
    timing(this.rotate, {
        toValue: this.rotateAngle[index],
        duration: 80,
        easing: Easing.bezier(.49, .32, .5, .19)
    }).start(() => {
        this.index = index + 1;
        this.rotateView();
    })
  }

  beginScale = () => {
      timing(this._animatedValue, {
         toValue: 4,
         duration:1500,
         easing: Easing.linear
      }).start(() => {
         this._animatedValue.setValue(1);
         this.beginScale();
      })
  }

  onMenuPress(){
    this.refs['menuInstance'].setVelocity({x: 2000});
  }

  onClosePress() {
    console.log('close');  
    this.refs['menuInstance'].setVelocity({x: -2000});
  }

  render() {
    const { navigation } = this.props;
    const transformStyle = {
          transform:[
              {scale: this._animatedValue}
          ]
    }

    const transformStyle1 = {
          transform:[
              {scale: this.scale1}
          ]
    }

    const transformStyle2 = {
          transform:[
              {scale: this.scale2}
          ]
    }
    return (
      <Fragment>  
            <View style={styles.header}>
                    <View style={{width:.25*widths, height:50}}> 
                        <Animated.View style={[styles.circle, transformStyle]}>
                        </Animated.View>    

                        <Animated.View style={[styles.circle, {borderColor:'#691053', ...transformStyle1}]}>
                        </Animated.View>

                        <Animated.View style={[styles.circle, {borderColor:'#311069', ...transformStyle2}]}>
                        </Animated.View>
                    </View>

                    <Animated.View style={[styles.title, {transform:[{rotate: this.angle }]}]}>
                        <Animated.View style={[styles.text, {transform:[{translateY: this.animated1}]}]}><Text style={{color:'#FFE1FF', fontSize:20}}>沙</Text></Animated.View>
                        <Animated.View style={[styles.text, {transform:[{translateY: this.animated2}]}]}><Text style={{color:'#FFE1FF', fontSize:20}}>巴</Text></Animated.View>
                        <Animated.View style={[styles.text, {transform:[{translateY: this.animated3}]}]}><Text style={{color:'#FFE1FF', fontSize:20}}>体</Text></Animated.View>
                        <Animated.View style={[styles.text, {transform:[{translateY: this.animated4}]}]}><Text style={{color:'#FFE1FF', fontSize:20}}>育</Text></Animated.View>       
                    </Animated.View>   

                    <View style={styles.box}>
                        <TouchableWithoutFeedback onPress={this.onClosePress.bind(this)}>
                            <View style={[styles.operation, {backgroundColor:'orange'}]}>
                                <Text>登录</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this.onMenuPress.bind(this)}>
                            <View style={[styles.operation, {backgroundColor:'yellowgreen'}]}>
                                <Text>注册</Text>
                            </View>
                        </TouchableWithoutFeedback>      
                    </View>       
            </View>
            <View style={styles.sideMenuContainer} pointerEvents='box-none'>
                <Interactable.View
                    ref='menuInstance'
                    horizontalOnly={true}
                    snapPoints={[{x: 0}, {x: -SideMenuWidth}]}
                    boundaries={{right: RemainingWidth/2}}
                    initialPosition={{x: -SideMenuWidth}}>
                    <View style={styles.sideMenu}>
                    <Text style={styles.sideMenuTitle}>Menu</Text>
                    <TouchableOpacity onPress={() => alert('Button 1 pressed')}>
                        <Text style={styles.button}>Button 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Button 2 pressed')}>
                        <Text style={styles.button}>Button 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('Button 3 pressed')}>
                        <Text style={styles.button}>Button 3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onClosePress.bind(this)}>
                        <Text style={styles.button}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                </Interactable.View>
            </View>
        </Fragment> 
    )
  }
}

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
      height:50,
      width:widths,
      backgroundColor: '#0E82B1',
      flexDirection: 'row',
      zIndex:100
  },
  div:{
      width:.33*widths,
      height:50,
      borderColor:'orange',
      borderRightWidth:1
  },
  operation: {
      width:.15*widths,
      height: 30,
      borderRadius:15,
      justifyContent:'center',
      alignItems:'center'
  },
  circle: {
      width:10, height:10, 
      borderWidth:1, 
      borderRadius:10, borderColor:'#10691F', 
      position:'absolute', left:.125*widths - 10, top:20
  },
  title: {
      width:.4*widths, height:50, 
      flexDirection:'row',
      alignItems:'center',
      paddingHorizontal:.08*widths
  },
  box: {
      width:.35*widths, 
      height:50, flexDirection:'row', 
      justifyContent:'space-between', 
      alignItems:'center'
  },
  text: {
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      height:50
  },
  sideMenuContainer: {
    position: 'absolute',
    top: 50,
    left: -RemainingWidth,
    right: 0,
    height: height - 50,
    flexDirection: 'row',
    zIndex: 10000
  },
  sideMenu: {
    left: 0,
    width: widths,
    paddingLeft: RemainingWidth,
    flex: 1,
    backgroundColor: '#D6EA86',
    paddingTop: 20
  },
  sideMenuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    color: '#542790',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20
  }
});

