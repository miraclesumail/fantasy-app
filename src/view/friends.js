import React, { Component, Fragment, useState, useEffect} from 'react'
import { Text, View, FlatList, Dimensions, Image, Animated, PanResponder, StyleSheet, Easing, TouchableWithoutFeedback } from 'react-native'

const { width, height } = Dimensions.get('window');
import {
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
      imgBox: {
          width, height: .5*height, 
          flexDirection:'row', justifyContent:'center',
          position:'absolute', top:0 
      }
})

const imgs = [
    require('../imgs/qq1.jpg'), require('../imgs/qq2.jpg'), require('../imgs/qq3.jpg'),
    require('../imgs/caocao.jpg'), require('../imgs/daojian.jpg'), require('../imgs/pushu.jpg')
]

function Post({item, setActive, onLayout}) {
     const arrs = item.content.split('\n');

     const [visible, setVisible] = useState(false);

     useEffect(() => {
        setTimeout(() => {
           setVisible(true);
        },2000)
        return () => {
        };
     }, [])

     return (
            <View style={{width:.9*width, flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#f0f0f0', paddingBottom:10}}>
                <View><Image source={require('../imgs/qq2.jpg')} style={{width:.1*width, height:.1*width}}/></View>
                <View style={{width:.8*width, paddingLeft:.05*width}}>
                    <View><Text style={{fontSize:20, fontWeight:'bold', color: '#4F88F2'}}>{item.name}</Text></View>
                    {
                        arrs.map(item => (
                            <View><Text style={{fontSize:16, color:'black', lineHeight:19}}>{item}</Text></View>
                        ))
                    }

                    <View style={{width:.75*width, flexDirection:'row', flexWrap:'wrap', marginTop:.015*width}} onLayout={onLayout}>
                        {
                            imgs.map((item,index) => (
                                
                                (index+1)%3 ? 
                                <TouchableWithoutFeedback onPress={() => setActive(index)}>
                                    <View style={{width:.24*width, height:.2*width,marginRight:.014*width, marginBottom:.015*width}}>
                                        <Image source={item} style={{width:.24*width, height:.2*width}}/>
                                    </View> 
                                </TouchableWithoutFeedback>
                                : 
                                <TouchableWithoutFeedback onPress={() => setActive(index)}>
                                    <View style={{width:.24*width, height:.2*width, marginBottom:.015*width}}>
                                         <Image source={item} style={{width:.24*width, height:.2*width}}/>
                                    </View>
                                </TouchableWithoutFeedback>  
                            ))
                        }
                    </View>

                    <View><Text style={{color:'grey', fontSize:14,lineHeight:20}}>{item.time}</Text></View>
                </View>     
            </View>
     )
}

class ImgMask extends Component{
    constructor(props){
        super(props);
        this.state = {
             horizonMove:false,
             missing: false
        }
        this.animatedValue = new Animated.Value(-props.active*width);
        this.animatedXY = new Animated.ValueXY;
        // 判断图片上下移动
        this.animatedY = new Animated.Value(0);

        this.animatedOpacity = new Animated.Value(.8);
        this.animatedScale = new Animated.Value(1);
        this.onMoving = false;
        this._value = {x:0, y:0};

        this.horizonMove = false;

        this.initAnimatedVal = -props.active*width;

        this.animatedXY.addListener(value => {
            this._value = value;
            
            if(this.horizonMove){
                this.animatedValue.setValue(value.x + this.initAnimatedVal);
            } else {
                if(this.onMoving) {

                    this.animatedY.setValue(value.y < 0 ? 0 : -value.y/height*.25*height);
                    this.animatedOpacity.setValue(value.y < 0 ? .8 : (1 - value.y/height)*.8);
                    this.animatedScale.setValue(value.y < 0 ? 1 : (1 - value.y/(2*height)));
 
                    
                    // this.animatedY = this.animatedXY.y.interpolate({
                    //     inputRange: [-100, 0, height],
                    //     outputRange: [0, 0, -.25*height],
                    //     extrapolate:'clamp'
                    // })

                    // this.animatedOpacity = this.animatedXY.y.interpolate({
                    //     inputRange: [-100, 0, height],
                    //     outputRange: [.8, .8, 0],
                    //     extrapolate:'clamp'
                    // })

                    // this.animatedScale = this.animatedXY.y.interpolate({
                    //     inputRange: [-100, 0, height],
                    //     outputRange: [1, 1, 0],
                    //     extrapolate:'clamp'
                    // })
                }  
            }
        })

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return true;   
            },
            onPanResponderGrant: (evt, gestureState) => {
                 this.animatedXY.setOffset({
                   x: this._value.x,
                   y: this._value.y
               })
               this.animatedXY.setValue({
                  x: 0,
                  y: 0
               })            
            },
            onPanResponderMove: (evt, gestureState) => {
                if(!this.onMoving && gestureState.dy < 0)
                    return false;
                console.log(gestureState.vy);
                if(!this.state.horizonMove && !this.onMoving && Math.abs(gestureState.vy) < 0.0000000000006){
                        this.setState({horizonMove: true});
                        this.horizonMove = true;
                }
                this.onMoving = true;
                Animated.event([null, { dx: this.animatedXY.x, dy: this.animatedXY.y}])(evt, gestureState);
            },  
            onPanResponderRelease: (evt, gestureState) => {
                this.animatedXY.flattenOffset();

                if(this.state.horizonMove) {
                    if(Math.abs(this._value.x) < .4*width)
                        Animated.timing(this.animatedValue, {
                            toValue: this.initAnimatedVal,
                            duration:300,
                            useNativeDriver: true
                        }).start(() => {
                            this.animatedXY.setValue({x:0, y:0});
                            this.setState({horizonMove: false});
                            this.horizonMove = false;
                            this.onMoving = false;
                        });
                    else
                        Animated.timing(this.animatedValue, {
                            toValue: this._value.x < 0 ? -(this.props.active + 1)*width : -(this.props.active - 1)*width,
                            duration:300,
                            easing: Easing.linear,
                            useNativeDriver: true
                        }).start(() => {
                            this.initAnimatedVal = this._value.x < 0 ? -(this.props.active + 1)*width : -(this.props.active - 1)*width
                            this.setState({horizonMove: false});
                            this.horizonMove = false;
                            this.onMoving = false;
                            this.props.setActive(this._value.x < 0 ? this.props.active + 1 : this.props.active - 1);
                            this.animatedXY.setValue({x:0, y:0});
                        });
                } else {
                    if(this._value.y < 0 || (this._value.y > 0 && this._value.y < 80)){
                        this.animatedXY.setValue({x:0, y:0});
                        this.onMoving = false;
                    } else {
                        this.setState({missing:true})
                        const {active} = this.props;
                        // x: 0.25*width + active%3*.255*width + .12*width y: props.layouts.y + 
                        const x = 0.20*width + active%3*.255*width + .12*width;
                        const y = this.props.layouts.y + (active/3 | 0)*.18*width + .1*width;

                        const imgx = .5*width;
                        const imgy = .38*height;
                        this.onMoving = false;
                        Animated.timing(this.animatedXY, {
                            toValue: {x : x-imgx, y : y - imgy},
                            duration:500,
                            useNativeDriver: true
                        }).start()

                        Animated.timing(this.animatedScale, {
                            toValue: .3,
                            duration:400,
                            useNativeDriver: true
                        }).start(() => {
                            
                        })

                        setTimeout(() => {
                            this.props.setActive(null);
                        }, 400);
                    }
                }
            }
        });

        this._baseScale = new Animated.Value(1);
  this._pinchScale = new Animated.Value(1);
  this._scale = Animated.multiply(this._baseScale, this._pinchScale);
  this._lastScale = 1;
 this._onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: this._pinchScale } }],
    { useNativeDriver: true }
  );

  this._onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };

    }
   
    render(){
        const {active} = this.props;
        const transformStyle = {
              transform:[
                  {translateX: this.animatedValue}
              ]
        }
        const transformStyleImg = this.animatedXY.getTranslateTransform();

        const transformImg = this.state.horizonMove ? {} : {
              transform: [
                  ...transformStyleImg,
                  {scale: this.animatedScale}
              ]
        };

        return(
            <Fragment>
                {
                   !this.state.missing ? <Animated.View style={{width, height, position:'absolute', left:0, top:0, backgroundColor:'rgb(39,42,47)', opacity: this.animatedOpacity}}>
                    </Animated.View> : null
                }
                
     
                  <Animated.View style={{width:width*6, height:.4*height,position:'absolute',left:0, flexDirection:'row', top:.18*height, ...transformStyle}}>
                    {
                        imgs.map((item,index) => (   
                            index == active ? 
                          
                                <Animated.View style={[styles.imgBox, {left:index*width}, transformImg]}>
                                    <Animated.Image source={item} style={{width:.95*width, height:.4*height, transform:[{scale: this._scale}, {translateY: this.animatedY}]}} {...this.panResponder.panHandlers}/>
                                </Animated.View>
                             : 
                            <Animated.View style={[styles.imgBox, {left:index*width}]}>
                                <Image source={item} style={{width:.95*width, height:.4*height}}/>
                            </Animated.View>
                        ))
                    }
                  </Animated.View>

                  {!this.state.missing ?
                    <View style={{position:'absolute', bottom:150, width, height:30, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                      {
                          imgs.map((item,index) => (
                              <View style={{width:10, height:10, borderRadius:5, marginRight: 5, backgroundColor: active == index ? 'yellowgreen' : '#ffffff'}}></View>
                          ))
                      }
                  </View> : null
                  }
                  


            </Fragment>    
        )
    }
}

class Friends extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
          title: params ? params.otherParam : '朋友圈',
          /* These values are used instead of the shared configuration! */
          headerStyle: {
            backgroundColor: navigationOptions.headerTintColor,
            height: 50,
          },
          headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
      }

    state = {
        infos: [
            {name:'being Ray', content:'打开快点快点快点快点回事\n解决实际上就是\n看看参考参考参考开车开车开车', time:'一小时前'},
            // {name:'being Ray', content:'打开快点快点快点快点回事\n解决实际上就是\n看看参考参考参考开车开车开车', time:'一小时前'}
        ],
        visible: false,
        active: null,
        layouts:{}
    }  

  componentDidMount(){
    //   setTimeout(() => {
    //      this.setState({visible: true})
    //   }, 2000);
  }   

   onLayout = ({nativeEvent: {layout:{x, y, width, height}}}) => {
        this.setState({layouts: {x,y}})
   }

  _keyExtractor = (item, index) => index + 'qq';
  
  render() {
    const {visible, active, layouts} = this.state;  
    return (
      <View style={{alignItems: 'center', width, height}}>
          <FlatList
              data={this.state.infos}
              extraData={this.state}
              renderItem={({item}) => <Post item={item} onLayout={this.onLayout} setActive={(active) => this.setState({active})}/>}
              keyExtractor={this._keyExtractor}
          />
          {active != null ? <ImgMask active={this.state.active} layouts={layouts} setActive={(active) => this.setState({active})}/> : null}
      </View>
    )
  }
}

export default Friends
