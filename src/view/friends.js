import React, { Component, Fragment, useState, useEffect} from 'react'
import { Text, TextInput, View, FlatList, Dimensions, Image, Animated, PanResponder, StyleSheet, Easing, TouchableWithoutFeedback, UIManager, findNodeHandle } from 'react-native'

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

const paintRed = Component => React.forwardRef(
    // 此例中，ref 为 ForwardRef 中的 textRef
    (props, ref) => (
        <Component forwardedRef={ref} {...props}></Component>
    )
)

function Post({item, setActive, onBoxLayout, onImgLayout, index, forwardedRef, likes, showComment}) {
     const arrs = item.content.split('\n');

     const [visible, setVisible] = useState(false);
     const [widths, setWidth] = useState(0);
     
     let animatedWidth = new Animated.Value(widths);
     
     useEffect(() => {
        if(visible && !widths)
            Animated.timing(animatedWidth, {
                toValue: .3*width,
                duration: 150
            }).start(() => setWidth(.3*width))

        if(!visible && widths) {
           Animated.timing(animatedWidth, {
                toValue: 0,
                duration: 150
            }).start(() => setWidth(0)) 
        }     
        return () => {
        };
     }, [visible])

     return (
            <View ref={forwardedRef} style={{width:.9*width, flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#f0f0f0', paddingBottom:10}} onLayout={onBoxLayout}>
                <View><Image source={item.avatar} style={{width:.1*width, height:.1*width}}/></View>
                <View style={{width:.8*width, paddingLeft:.05*width}}>
                    <View><Text style={{fontSize:20, fontWeight:'bold', color: '#4F88F2'}}>{item.name}</Text></View>
                    {
                        arrs.map(item => (
                            <View><Text style={{fontSize:16, color:'black', lineHeight:19}}>{item}</Text></View>
                        ))
                    }

                    <View style={{width:.75*width, flexDirection:'row', flexWrap:'wrap', marginTop:.015*width}} onLayout={onImgLayout}>
                        {
                            imgs.map((item,index1) => (
                                
                                (index1+1)%3 ? 
                                <TouchableWithoutFeedback onPress={() => setActive(index1, index)}>
                                    <View style={{width:.24*width, height:.2*width,marginRight:.014*width, marginBottom:.015*width}}>
                                        <Image source={item} style={{width:.24*width, height:.2*width}}/>
                                    </View> 
                                </TouchableWithoutFeedback>
                                : 
                                <TouchableWithoutFeedback onPress={() => setActive(index1, index)}>
                                    <View style={{width:.24*width, height:.2*width, marginBottom:.015*width}}>
                                         <Image source={item} style={{width:.24*width, height:.2*width}}/>
                                    </View>
                                </TouchableWithoutFeedback>  
                            ))
                        }
                    </View>

                    <View style={{width:.75*width, flexDirection:'row', justifyContent:'space-between'}}>
                        <View><Text style={{color:'grey', fontSize:14,lineHeight:20}}>{item.time}</Text></View>
                        <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
                            <View style={{backgroundColor:'#f0f0f0', width:.08*width, height:20, borderRadius:4, marginRight:5,justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize:18, lineHeight:20, fontWeight:'bold', color:'#c6c6c6'}}>..</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <Animated.View style={{position:'absolute', right:.12*width, borderRadius:5, flexDirection:'row', width:animatedWidth, height:20, justifyContent:'space-around',alignItems:'center', backgroundColor:'#495569'}}>
                           <TouchableWithoutFeedback onPress={() => likes()}>
                                <View><Text style={{color:'pink'}}>❤️赞</Text></View>
                           </TouchableWithoutFeedback>

                           <TouchableWithoutFeedback onPress={() => showComment(index)}>
                                <View><Text style={{color:'pink'}}>🐂评论</Text></View> 
                           </TouchableWithoutFeedback>        
                           {
                               visible || widths ? 
                                <View style={{position:'absolute', width:10, height:10, right:0, top:1, backgroundColor:'#495569', transform:[{rotate:'45deg'}, {translateX:5}]}}>
                                </View> : null
                           }       
                        </Animated.View>
                    </View>
                    {
                        item.likes ? 
                        <View style={{width:.75*width, marginVertical:8, backgroundColor:'#f0f0f0'}}>
                          <Text style={{lineHeight:25}}>❤️ +{item.likes}</Text>
                        </View> : null
                    }   

                    {
                        item.comments ? 
                        <Fragment>
                            {
                                item.comments.map(item => (
                                    <View style={{width:.75*width, paddingLeft:5, flexDirection:'row', backgroundColor:'#f0f0f0'}}>
                                       <Text style={{lineHeight:25, color:'#E48947'}}>阿西吧: </Text> 
                                       <Text style={{lineHeight:25}}>{item}</Text>
                                    </View> 
                                ))
                            } 
                        </Fragment> : null
                    }             
                </View>     
            </View>
     )
}

const DecPost = paintRed(Post)


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
                    this.animatedOpacity.setValue(value.y < 0 ? .8 : (1 - value.y/(1.5*height))*.8);
                    this.animatedScale.setValue(value.y < 0 ? 1 : (1 - value.y/(1.3*height)));
 
                    
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

                if(this.state.horizonMove && this.props.active == 5 && this._value.x <= -.2*width) 
                   return  

                if(this.state.horizonMove && this.props.active == 0 && this._value.x >= .2*width) 
                   return     
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
                const { active } = this.props;
                if(this.state.horizonMove) {
                    

                    if(Math.abs(this._value.x) < .4*width || (active == 5 && this._value.x < 0) || (active == 0 && this._value.x > 0))
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
                        console.log('爱家居安静姐姐');
                        this.setState({missing:true})
                        const {active, boxHeightArr, imgsTopArr, presentIndex, scrollTop} = this.props;
                        // x: 0.25*width + active%3*.255*width + .12*width y: props.layouts.y + 
                        const x = 0.20*width + active%3*.255*width + .12*width;

                        const needAddHeight = presentIndex ? boxHeightArr.filter((item,index) => index <= presentIndex - 1).reduce((prev,next) => prev + next) : 0;
                        const y = needAddHeight + imgsTopArr[presentIndex].y + (active/3 | 0)*.18*width + .1*width - scrollTop;
                       // const y = this.props.layouts.y + (active/3 | 0)*.18*width + .1*width;

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
                                    <Animated.Image source={item} style={{width:.95*width, height:.4*height, transform:[ {translateY: this.animatedY}]}} {...this.panResponder.panHandlers}/>
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
   constructor(props){
        super(props);
        this.state = {
            infos: [
                {name:'being Ray', content:'打开快点快点快点快点回事\n解决实际上就是', time:'一小时前', avatar: require('../imgs/qq2.jpg')},
                {name:'sumail Lei', content:'我今天去理发店理发花了300p\n日 心疼....\n晚上又开始了敲代码', time:'10分钟前', avatar: require('../imgs/qq1.jpg')},
                {name:'sumail Lei', content:'我今天去理发店理发花了300p\n日 心疼....😊\n晚上又开始了敲代码\n晚上又开始了敲代码', time:'10分钟前', avatar: require('../imgs/qq3.jpg')}
                // {name:'being Ray', content:'打开快点快点快点快点回事\n解决实际上就是\n看看参考参考参考开车开车开车', time:'一小时前'}
            ],
            visible: false,
            active: null,
            presentIndex: null,
            layouts:{},
            layArrs: [],
            boxLayouts:[],
            imgLayouts:[],
            scrollTop:0,
            showComment:false,
            comment:''
        }  
        //this.postRef = React.createRef();
        for(let i = 0; i<3;i++){
            this['postRef' + i] = React.createRef();
        }    
   }  

  componentDidMount(){
      setTimeout(() => {
            console.log(this.state.boxLayouts, '     //  console.log(this.state.imgLayouts);');
      }, 100)
        // setTimeout(() => {
        //     console.log(this.state.imgLayouts);
        //     //console.log(this.state.boxLayouts);
        //     for(let i = 0; i<3;i++){
        //         UIManager.measure(findNodeHandle(this['postRef'+i].current),(x,y,width,height,pageX,pageY)=>{
        //                console.log(x,y, pageX,pageY, 'dldlldldld');
        //                this.setState({boxLayouts: [...this.state.boxLayouts, {x:pageX, y:pageY}]})
        //         })
        // }    
        // }, 2500);   
  }   

  voteMsg = (index) => {
      const infos = this.state.infos.slice();
      const changeInfo = {...infos[index], likes: !infos[index].likes ? 1 : infos[index].likes + 1};
      infos[index] = changeInfo;
      this.setState({infos});
  }

  addComment = (index) => {
      if(!this.state.comment) {this.setState({showComment:false, presentIndex:null});return}
      const infos = this.state.infos.slice();
      const changeInfo = {...infos[index], comments: !infos[index].comments ? [this.state.comment] : [...infos[index].comments, this.state.comment]};
      infos[index] = changeInfo;
      this.setState({infos, comment:'', showComment:false});
  }

  onBoxLayout = ({nativeEvent: {layout:{x, y, width, height}}}) => {
        console.log(width,height, '在家vivo噢从此');
        if(this.state.presentIndex == null)
           this.setState({boxLayouts: [...this.state.boxLayouts, height]});
        else {
           console.log('无地自容') 
           const boxLayouts = this.state.boxLayouts.slice();
           boxLayouts[this.state.presentIndex] = height;
           this.setState({boxLayouts, presentIndex:null})
        }   
  }

  onImgLayout = ({nativeEvent: {layout:{x, y, width, height}}}) => { 
        this.setState({imgLayouts: [...this.state.imgLayouts, {x,y}]});
  }

//   onLayout = ({nativeEvent: {layout:{x, y, width, height}}}) => {
//         this.setState({layouts: {x,y}});
//   }

  _keyExtractor = (item, index) => index + 'qq';
  
  render() {
    const {visible, active, layouts, boxLayouts, imgLayouts, scrollTop, presentIndex, showComment} = this.state;  
    return (
      <View style={{alignItems: 'center', width, height, paddingBottom:110}}>
          <FlatList
              data={this.state.infos}
              initialNumToRender={9}
              onScroll={(e)=>{
                    console.log(e.nativeEvent.contentOffset.y);
                    this.setState({scrollTop: e.nativeEvent.contentOffset.y})
                }}
              extraData={this.state}
              renderItem={({item, index}) => <DecPost ref={this['postRef'+index]}  scrollTop={scrollTop} showComment={(presentIndex) => this.setState({showComment:true, presentIndex})}likes={() => this.voteMsg(index)} index={index} item={item} onImgLayout={this.onImgLayout} onBoxLayout={this.onBoxLayout} setActive={(active, presentIndex) => {this.setState({active, presentIndex});console.log(scrollTop)}}/>}
              keyExtractor={this._keyExtractor}
          />
          {active != null ? <ImgMask active={this.state.active} presentIndex={presentIndex} scrollTop={scrollTop} boxHeightArr={boxLayouts} imgsTopArr={imgLayouts} setActive={(active) => this.setState({active})}/> : null}
          {
               showComment ?
               <View style={{position:'absolute',bottom:105, backgroundColor:'#f0f0f0', width, height:50, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                <TextInput onChangeText={text => this.setState({comment: text})} autoFocus={true} placeholder={'评论'}  placeholderTextColor={'#c3c3c3'} style={{width:.8*width,paddingHorizontal: 10, height:35, borderColor:'grey', borderWidth:1, borderRadius:5, backgroundColor:'#ffffff'}}/>
                <TouchableWithoutFeedback onPress={() => this.addComment(presentIndex) }>
                    <View style={{width:.1*width, height:35, borderColor:'grey', borderWidth:1, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                        <Text>发送</Text>
                    </View>
                </TouchableWithoutFeedback>   
              </View> : null
          }
          
      </View>
    )
  }
}

export default Friends
