import React, { Component, useRef, useState, useEffect, Fragment } from 'react'
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, PanResponder, Image, Animated, Easing } from 'react-native'
import Swiper from 'react-native-swiper';
import RNPickerSelect from 'react-native-picker-select';
import CustomProgress from '../components/custom_progress'
import {connect} from 'react-redux';
import Carousel from 'react-native-looped-carousel';
const { width,height } = Dimensions.get('window');

const { Value, divide, concat, add } = Animated;

const renderPagination = (index, total, context) => {
  return (
    <View style={styles.paginationStyle}>
      <Text style={{ color: 'grey' }}>
        <Text style={styles.paginationText}>{index + 1}</Text>/{total}
      </Text>
    </View>
  )
}

const images = [
      require('../imgs/h1.jpeg'),require('../imgs/h2.jpeg'),require('../imgs/h3.jpeg'),require('../imgs/h4.jpeg'),
      require('../imgs/h5.jpeg'),require('../imgs/h6.jpeg'),require('../imgs/h7.jpeg'),require('../imgs/h8.jpeg'),
      require('../imgs/h9.jpeg'),require('../imgs/h10.jpeg'),require('../imgs/h11.jpeg'),require('../imgs/h12.jpeg'),
      require('../imgs/h13.jpeg')
]

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Test({number}) {
    const [count, setCount] = useState(0);
    const [count1, setCount1] = useState(0);
    const prevNumber = usePrevious(number);
    const prevCount = usePrevious(count);
    
    useEffect(() => {
          console.log('effect');

           console.log(prevCount, count);
          if(prevNumber == number){
              console.log('sameme');
              return
          }
          console.log('sameme111111');
          setCount(number*2);
          return () => {
              console.log('ffff')
          }
    }, [count])


    return (
        <Fragment>
            <TouchableWithoutFeedback onPress={() => setCount(count+1)}>
                <View><Text>{count} prev </Text></View>
            </TouchableWithoutFeedback>
             <TouchableWithoutFeedback onPress={() => setCount1(count1+1)}>
                <View><Text>{count1} </Text></View>
            </TouchableWithoutFeedback>
        </Fragment>
    )
}

class Star extends Component {
      state = {
           isLiking: false,
           n:0
      }

      translateX = new Animated.Value(0);
     
      animatingStar = (fn) => {
          this.setState({isLiking: true});
          const timer = setInterval(() => {
                let {n} = this.state;
                console.log(n);
                if(n == 12) {
                  this.setState({isLiking: false});
                  this.setState({n:0});
                  this.translateX.setValue(0);
                  fn && fn();
                  clearInterval(timer);
                  return;
                }
                this.setState({n: ++n})
                this.translateX.setValue(-n*34);
         }, 60)  
      }

      handlePress = () => {
            const {isFavorite, toggleLike} = this.props;
            if(!isFavorite){
                  this.animatingStar(toggleLike);
            }else{
                  console.log('nowoo o')
                  toggleLike();
            }
      }

      render(){
            const {isFavorite} = this.props;
            const {isLiking} = this.state;
            const transformStyle = {
                transform: [{
                    translateX: this.translateX
                }]
            }

            const liking =  (<Animated.View style={{width:442,height:34, backgroundColor:'pink', flexDirection:'row', ...transformStyle}}>
                  {images.map(item => (
                        <Image source={item} style={{width: 34, height:34}}/>
                  ))}
            </Animated.View>)   

            const image = (
               <TouchableWithoutFeedback onPress={() => this.handlePress()}>
                        <View style={{width:34,height:34, backgroundColor:'pink', flexDirection:'row'}}>
                            <Image source={isFavorite ? require('../imgs/h13.jpeg') : require('../imgs/h1.jpeg')} style={{width: 34, height:34}}/>
                        </View>
               </TouchableWithoutFeedback>
           )
           const renderBox = isLiking ? liking : image 

            return (
                 <Fragment>
                    {renderBox}
                 </Fragment>
                 
            )
      }     
}

class ShakingBox extends Component {
    constructor(props){
        super(props);

        this.rotate = new Animated.Value(0);

        this.rotateAngle = this.rotate.interpolate({
            inputRange:[-1,1], 
            outputRange:['-2deg', '2deg'],
            extrapolate:'clamp'
        })
    }
    
    componentDidMount() {  
        setTimeout(() => {
           this.AnimatedAngle(true);
        },300)
    }

    AnimatedAngle = (flag) => {
        Animated.timing(this.rotate, {
            toValue: flag ? 1 : -1,
            duration:80,
            easing: Easing.linear
        }).start(() => {
            this.AnimatedAngle(!flag);
        })
    }

    render(){
        const {children, cancelShaking, deleteItem, toTop, index} = this.props;
        const transformStyle = {
              transform: [
                 {scale: .8},
                 {rotate: this.rotateAngle}
              ]
        }
        return (
          <Fragment>
              <Animated.View style={{width: width*.333, height:width*.4,backgroundColor:'yellowgreen', ...transformStyle}}>
                  {children}                
              </Animated.View>
              <View style={{position:'absolute', width: width*.333, height:width*.4, left:0, top:0, backgroundColor:'rgba(12,15,13,.4)', justifyContent:'space-around', alignItems:'center', paddingVertical:.08*width}}>
                    {
                        index ?  <TouchableWithoutFeedback onPress={() => {cancelShaking();toTop()}}>
                                  <View style={{width:0.2*width, height:.07*width,justifyContent:'space-around', alignItems:'center', backgroundColor:'#92CDA2', borderRadius:10}}><Text>置顶</Text></View>
                        </TouchableWithoutFeedback> : null
                    }
                   
                    <TouchableWithoutFeedback onPress={() => deleteItem()}>
                        <View style={{width:0.2*width, height:.07*width,justifyContent:'space-around', alignItems:'center', backgroundColor:'#DE9B19', borderRadius:10}}><Text>删除</Text></View>
                    </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={() => cancelShaking()}>
                  <View style={{position:'absolute', top:0, right:0, width:width*.06, height:width*.06, backgroundColor:'yellow', justifyContent:'center', alignItems:'center',borderRadius:width*.03}}>
                          <Text style={{fontSize:18}}>-</Text>
                  </View>
              </TouchableWithoutFeedback>
          </Fragment>
        )
    }
}

function Rating({hot}) {
     const colors = ['#EDCA84', '#E8B754', '#E9AB2E', '#E89D07']

     return (
         <View style={{width:.133*width, height:.067*width, paddingHorizontal:.01*width, flexDirection:'row',justifyContent:'space-around', alignItems:'center'}}>
               {
                   Array.from({length:4}, (v,i) => i+1).map((item,index) => (
                       <View style={{width:.02*width, height:.04*width, backgroundColor: hot >= item ? colors[index] : 'transparent'}}>
                       </View>
                   ))
               }
         </View>
     )
}

const judges = [
    {
        label: '按日均投注',
        value: 'avg_amount',
    },
    {
        label: '按日均人数',
        value: 'avg_person',
    },
    {
        label: '按日均奖金',
        value: 'avg_bonus'
    },
    {
        label: '高级筛选',
        value: 'multi_choice'
    }
];

const orders = [
    {
        label: '升序',
        value: 'up'
    },
    {
        label: '降序',
        value: 'down'
    }
]

class HomePage extends Component {
  constructor(props){
       super(props);
       this.state = {
          number: 0,
          shakingArr: Array.from({length:props.gamesList.hotRecommend.length}, (v,i) => ({index:i, shaking:false})),
          judge: judges[0].value,
          order: orders[0].value,
          newProducts: props.gamesList.newProducts.slice().sort((prev, next) => prev[judges[0].value] - next[judges[0].value]),
          minVal: 1,
          showAdvance:false,
          minAmount: 10,
          maxAmount: 19,
          showIndex: 0
       } 
       this.myRef1 = React.createRef();
       this.myRef2 = React.createRef();  
  }
  

  componentDidMount() {
      setInterval(() => {
          this.setState({number: this.state.number + 1})
      },2000)
  }

  componentWillReceiveProps(nextProps){
      const {shakingArr} = this.state;
      if(shakingArr.length != nextProps.gamesList.hotRecommend.length){
            const length = nextProps.gamesList.hotRecommend.length;
            const shakingArr = Array.from({length}, (v,i) => ({index:i, shaking:false}))
            this.setState({shakingArr})
      }
  }

  orderProducts = () => {
      const {order, judge, minAmount} = this.state;
      const products = this.props.gamesList.newProducts.slice();
      if(judge != 'multi_choice') {
           const newProducts = products.sort((prev, next) => order == 'up' ? prev[judge] - next[judge] : next[judge] - prev[judge])
           this.setState({newProducts});
      } else {
           const scoreMin = this.myRef1.current.score;
           const scoreMax = this.myRef2.current.score;
           //const amountMin = this.myRef2.current;
           console.log(minAmount);
           const newProducts = products.filter(item => item.avg_score <= scoreMax && item.avg_score >= scoreMin);
           this.setState({newProducts});
      }    
  }

  getDays = (date) => {
      let prev = new Date(date).getTime();
      let now = new Date().getTime();
      return Math.ceil((now - prev)/1000/24/3600);
  }

  setShaking = (index, flag) => {
      let shakingArr = this.state.shakingArr.slice();
      shakingArr[index].shaking = flag;
      this.setState({shakingArr});
  }

  renderRow(obj, index) {
    return (
      <View style={[styles.cell,{backgroundColor:index % 2 === 0 ? 'red' : 'yellow'}]}>
        <Text>{obj}</Text>
      </View>
    )
  }

  render() {
      const placeholder = {
            label: '选择参数',
            value: null,
            color: '#9EA0A4',
        };
    const {gamesList, toggleLike, deleteItem, toTop } = this.props;
    const {shakingArr, newProducts, judge, minVal, showAdvance, showIndex} = this.state;

    const containerHeight = Math.ceil(newProducts.length / 3)*.4*width;
    const gameRecommend = (
          <View style={{width, height:width*.4, flexDirection:'row'}}>
             {gamesList.hotRecommend.map((item,index) => (
                 <TouchableWithoutFeedback onLongPress={() => this.setShaking(index, true)}>
                    <View style={{width: width*.333, height:width*.4, justifyContent:'center', alignItems:'center'}}>
                        {
                             (shakingArr.length && shakingArr[index].shaking)? 
                              <ShakingBox cancelShaking={() => this.setShaking(index, false)} deleteItem={() => deleteItem(index)} toTop={() => toTop(index)} index={index}>
                                <Image source={item.img} style={{width: width*.333, height:width*.333}}/>
                                <View style={{width: width*.333, height:.067*width, flexDirection:'row', backgroundColor:'#7BA9B6'}}>
                                      <View style={{width: width*.2, height:.067*width, justifyContent:'center', alignItems:'center'}}>
                                            <Text style={{fontSize:16}}>{item.name}</Text>               
                                      </View>
                                      <Rating hot={item.hot}/>
                                </View>
                                <View style={{position:'absolute',left:width*.333 - 34, width:34, height:34,top:0, overflow:'hidden'}}>   
                                      <Star isFavorite={item.isFavorite} toggleLike={() => toggleLike(item.id)}/>   
                                </View>  
                             </ShakingBox> :   
                             <View style={{width: width*.333, height:width*.4,backgroundColor:'yellowgreen'}}>
                                <Image source={item.img} style={{width: width*.333, height:width*.333}}/>
                                <View style={{width: width*.333, height:.067*width, flexDirection:'row',backgroundColor:'#7BA9B6'}}>
                                      <View style={{width: width*.2, height:.067*width, justifyContent:'center', alignItems:'center'}}>
                                            <Text style={{fontSize:16}}>{item.name}</Text>               
                                      </View>
                                      <Rating hot={item.hot}/>
                                </View>                                
                                <View style={{position:'absolute',left:width*.333 - 34, width:34, height:34,top:0, overflow:'hidden'}}>   
                                      <Star isFavorite={item.isFavorite} toggleLike={() => toggleLike(item.id)}/>   
                                </View>  
                             </View>
                        }         
                    </View>  
                 </TouchableWithoutFeedback>
              )
             )}
          </View>       
    )

    const singleChoose = (
          <View style={{width:width, height:40, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                    <View style={{width:.3*width, height:40}}>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={judges}
                            onValueChange={(value) => {
                                this.setState({
                                    judge: value,
                                });
                            }}
                            style={pickerSelectStyles}
                            value={this.state.judge}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>
                
                    <View style={{width:.3*width, height:40}}>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={orders}
                            onValueChange={(value) => {
                                this.setState({
                                    order: value
                                });
                            }}
                            style={pickerSelectStyles}
                            value={this.state.order}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>

                    <TouchableWithoutFeedback onPress={() => this.orderProducts()}>
                        <View style={{width:.2*width, height:40, borderRadius:10, backgroundColor:'#FFA07A', justifyContent:'center', alignItems:'center'}}>
                                <Text>确认</Text>
                        </View>
                    </TouchableWithoutFeedback>       
              </View>
    )

    const newProduct = (
          <Fragment>
              {
                  judge == 'multi_choice' ? 
                   <View style={{width, height:30, paddingHorizontal:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                       <TouchableWithoutFeedback onPress={() => this.setState({showAdvance: !this.state.showAdvance})}>
                            <View>
                                <Text style={{fontSize:17, color:'#FFA500'}}>评分</Text>
                            </View>  
                       </TouchableWithoutFeedback>     
                       <CustomProgress ref={this.myRef1}  width={.35*width} height={20} min={1} max={9} setMinVal={(minVal) => this.setState({minVal})}/>
                       <CustomProgress ref={this.myRef2} width={.35*width} height={20} min={minVal} max={10}/>
                       <TouchableWithoutFeedback onPress={() => this.orderProducts()}>
                           <View>
                               <Text style={{fontSize:17, color:'#FF4500'}}>--</Text>
                           </View>
                       </TouchableWithoutFeedback>    
                   </View> : singleChoose
              }
              <View style={{width, height:containerHeight, flexDirection:'row', flexWrap:'wrap',justifyContent:'space-around', marginTop:20}}>
                    {
                        newProducts.map((v,i) => (
                            <View style={{width:.25*width, height:.4*width, alignItem:'center', justifyContent:'space-between',backgroundColor:'#29C9C2'}}>
                                <Image source={v.img} style={{width: width*.25, height:width*.25,borderRadius:width*.125}}/>
                                <View style={{width:.25*width, height:.1*width, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#FFA07A'}}>
                                    <View style={{width:.125*width, height:.1*width, justifyContent:'center', alignItems:'center'}}><Text>{v.name}</Text></View> 
                                    <View style={{width:.125*width, height:.1*width, justifyContent:'center', alignItems:'center'}}><Text>{this.getDays(v.release_date)}天</Text></View> 
                                </View>
                            </View>
                        ))
                    }     
              </View>    
          </Fragment>
          
    )

    return (
       <View style={styles.container}>
           <View style={{height:200}}>
             <Swiper horizontal={true} autoplay autoplayTimeout={2}
                dot={<View style={{backgroundColor: 'grey', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                activeDot={<View style={{backgroundColor: 'green', width: 12, height: 12, borderRadius: 6, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
             >
                <View style={styles.slide1}>
                    <Text style={styles.text}>Hello Swiper</Text>
                </View>
                <View style={styles.slide2}>
                    <Text style={styles.text}>Beautiful</Text>
                </View>
                <View style={styles.slide3}>
                    <Text style={styles.text}>And simple</Text>
                </View>
             </Swiper>
           </View>
           
            <View style={{width, height:50, flexDirection:'row'}}>
                  <View style={{width:100, height:50, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}>
                        <Text>最新通告</Text>
                  </View>

                  <View style={{ width:width-100, height:50 }} onLayout={this._onLayoutDidChange}>
                    <Carousel
                    delay={2000}
                    style={{width:width-100, height:50}}
                    autoplay
                    >
                    <View style={[{ backgroundColor: '#BADA55' }, {width:width-100, height:50}]}>
                        <Text>111111111111111111111</Text>
                    </View>
                    <View style={[{ backgroundColor: 'chocolate' }, {width:width-100, height:50}]}>
                        <Text>22222222222222222222</Text>
                    </View>
                    <View style={[{ backgroundColor: 'yellowgreen' }, {width:width-100, height:50}]}>
                        <Text>33333333333333333333</Text>
                    </View>
                    </Carousel>
                </View>
            </View>

            <View style={{width, height:40, flexDirection:'row'}}>
               <TouchableWithoutFeedback onPress={() => this.setState({showIndex:0})}>
                   <View style={{flex:1, backgroundColor: showIndex == 0 ? '#37C0DB':'#8F6FB9', justifyContent:'center', alignItems:'center', borderRightWidth:1, borderRightColor:'#6FAAB9'}}><Text>热门推荐</Text></View></TouchableWithoutFeedback>
               <TouchableWithoutFeedback onPress={() => this.setState({showIndex:1})}>
                   <View style={{flex:1, backgroundColor: showIndex == 1 ? '#37C0DB':'#8F6FB9', justifyContent:'center', alignItems:'center', borderRightWidth:1, borderRightColor:'#6FAAB9'}}><Text>新款上市</Text></View></TouchableWithoutFeedback>
               <TouchableWithoutFeedback onPress={() => this.setState({showIndex:2})}>
                   <View style={{flex:1, backgroundColor: showIndex == 2 ? '#37C0DB':'#8F6FB9', justifyContent:'center', alignItems:'center', borderRightWidth:1, borderRightColor:'#6FAAB9'}}><Text>我的收藏</Text></View></TouchableWithoutFeedback>
            </View>       
            {showIndex == 0 ? gameRecommend : showIndex == 1 ? newProduct : null}

            {
                showAdvance ?
                    <TouchableWithoutFeedback onPress={() => this.setState({showAdvance: !this.state.showAdvance})}>
                          <View style={{position:'absolute', width, height, flexDirection:'row', alignItems:'center', backgroundColor:'rgba(8,18,17,.8)'}}>
                                <SliderBox range={[5,6,7,8,9,10,11,12,13,14]} setAmount={(minAmount) => this.setState({minAmount})}/>
                                <SliderBox range={[15,16,17,18,19,20,21,22,23,24]} setAmount={(maxAmount) => this.setState({maxAmount})}/>
                          </View> 
                    </TouchableWithoutFeedback>  : null        
            }
            
            {/*<View style={{width: width*.333, height:width*.4,backgroundColor:'yellowgreen'}}>
                <Image source={require('../imgs/qq1.jpg')} style={{width: width*.333, height:width*.333}}/>
                <Text style={{display:'flex',width: width*.333, height:.067*width, justifyContent:'center', alignItems:'center'}}>植物大战僵尸</Text>
            </View>
           */}
       </View>    
    )
  }
}

class SliderBox extends Component {
      constructor(props){
            super(props);
            this.state = {
                animating: false,
                prevDis: 0,
                count: 0
            }

            this.targetVal = props.range[5];

            this.animatedValue = new Animated.Value(0);
            this.animatedValueUp = new Animated.Value(0);
            this._value = 0;

            this.animatedValue.addListener(({value}) => { 
                const {prevDis} = this.props;
                if(!this.state.animating) {
                    if(value - prevDis > 25 ){
                        this.animatedValue.setValue(25);
                        return;
                    }
                    if(value - prevDis < -25 ){
                        this.animatedValue.setValue(-25);
                        return;
                    }
                }
                this.animatedValueUp.setValue(value*.8);            
                this._value = value;
            })

            this.panResponder = PanResponder.create({
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => {
                    return true;   
                },
                onPanResponderGrant: (evt, gestureState) => {
                    console.log(this._value);
                    this.animatedValue.setOffset(this._value);
                    this.animatedValue.setValue(0);
                },
                onPanResponderMove: (evt, gestureState) => {
                    console.log(this._value, '2929939393993');
                    if(this.state.animating) return;

                    if(this.state.count == 5 && gestureState.vy >0) return;
                    if(this.state.count == -4 && gestureState.vy <0) return;

                    const {prevDis} = this.state;
                    if((gestureState.vy > 0 && this._value - prevDis >= 25) || (gestureState.vy < 0 && this._value - prevDis <= -25)) {
                        console.log('gestureState.vy---d-d-e-e-e--e-e-e-e-e')
                        return;             
                    }    

                    if(gestureState.vy > .8){
                        console.log('ozuzoppppppppppppppp');
                        this.setState({animating: true});
                        Animated.timing(this.animatedValue, {
                            toValue: 50,
                            duration: 300,
                            easing: Easing.linear
                        }).start(() => {
                            const {count} = this.state;
                            this.setState({animating: false}); 
                            this.setState({prevDis: this._value, count: this.state.count + 1})
                            this.targetVal = this.props.range[5 - count - 1];
                            this.props.setAmount(this.targetVal);
                        });
                        return;
                    }   

                    if(gestureState.vy < -.8){
                        console.log('ozuzoppppppppppppppp');
                        this.setState({animating: true});
                        Animated.timing(this.animatedValue, {
                            toValue: -50,
                            duration: 300,
                            easing: Easing.linear
                        }).start(() => {
                            const {count} = this.state;
                            this.setState({animating: false}); 
                            this.setState({prevDis: this._value, count: this.state.count - 1});
                            this.targetVal = this.props.range[5 - count + 1];
                            this.props.setAmount(this.targetVal);
                        });
                        return;
                    }               
                    Animated.event([null, { dy: this.animatedValue}])(evt, gestureState);
                },  
                onPanResponderRelease: (evt, gestureState) => {
                    console.log("release");
                    console.log(this._value);
                    console.log(gestureState.dy);
                    if(this.state.animating) return;
                    Animated.timing(this.animatedValue, {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.linear
                    }).start();
                }
            });
      }  

      render() {
          const transformStyle = {
                transform: [
                    {translateY: this.animatedValue}
                ]
          }  

          const transformStyle1 = {
                transform: [
                    {translateY: this.animatedValueUp}
                ]
          }  
          const {range} = this.props;  
          const up = ['min', ...range];   
          const down = [...range, 'max'];   
          return (
             <View style={{width:0.5*width, height, justifyContent:'center', alignItems:'center'}}> 
                    <View style={{width:40, height:40, overflow:'hidden',backgroundColor:'#FFD39B', marginBottom:10}}>
                        <Animated.View style={{width:40, height:440, position:'absolute', top:-200, ...transformStyle1}}>
                                {
                                    up.map((item,index) => (
                                        <View style={{width:40, height:40, backgroundColor:'#FFD39B', justifyContent:'center', alignItems:'center'}}><Text>{item}</Text></View>
                                    ))
                                }
                            </Animated.View>     
                    </View>

                    <View style={{width:50, height:50, overflow:'hidden', backgroundColor:'#FFB90F', marginBottom:10}} {...this.panResponder.panHandlers}>    
                            <Animated.View style={{width:50, height:500, position:'absolute', top:-250, ...transformStyle}}>
                                {
                                    range.map((item,index) => (
                                        <View style={{width:50, height:50, backgroundColor:'#FFB90F', justifyContent:'center', alignItems:'center'}}><Text>{item}</Text></View>
                                    ))
                                }
                            </Animated.View>        
                    </View> 

                    <View style={{width:40, height:40, overflow:'hidden',backgroundColor:'#FFDEAD'}}>
                        <Animated.View style={{width:40, height:440, position:'absolute', top:-240, ...transformStyle1}}>
                                {
                                    down.map((item,index) => (
                                        <View style={{width:40, height:40, backgroundColor:'#FFD39BD', justifyContent:'center', alignItems:'center'}}><Text>{item}</Text></View>
                                    ))
                                }
                            </Animated.View>     
                    </View>
             </View>    
          )      
      }    
}

function mapStateToProps (state) {
  return {
     gamesList: state.people.gamesList,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleLike: (id) => dispatch({type: 'toggleLike', id}),
    deleteItem: (index) => dispatch({type: 'deleteItem', index}),
    toTop: (index) => dispatch({type: 'toTop', index})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

const styles = StyleSheet.create({
      container: {
        flex:1,
        backgroundColor:'#3C3C39'
      },
      slide1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        height:200
      },
  slide2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
    height:200
  },
  slide3: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
    height:200
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  paginationText: {
    color: 'white',
    fontSize: 20
  },
  cell: {
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
   container1: {
        width,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#f1f2f6",
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        //width:.5*width,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 8,
        color: 'yellow',
        paddingRight: 0, // to ensure the text is never behind the icon
    },
    
    // inputAndroidContainer: {
    //     backgroundColor:'green'
    // },
    // viewContainer: {
    //     backgroundColor:'pink'

    // }
});