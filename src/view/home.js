import React, { Component, useRef, useState, useEffect, Fragment } from 'react'
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, Image, Animated, Easing } from 'react-native'
import Swiper from 'react-native-swiper';
import RNPickerSelect from 'react-native-picker-select';
import {connect} from 'react-redux';
import Carousel from 'react-native-looped-carousel';
const { width } = Dimensions.get('window');

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

const sports = [
    {
        label: 'Football',
        value: 'football',
    },
    {
        label: 'Baseball',
        value: 'baseball',
    },
    {
        label: 'Hockey',
        value: 'hockey',
    },
];

class HomePage extends Component {
  constructor(props){
       super(props);
       this.state = {
          shakingArr: Array.from({length:props.gamesList.hotRecommend.length}, (v,i) => ({index:i, shaking:false}))
       } 
  }
  

  ref = React.createRef();

  componentWillReceiveProps(nextProps){
      const {shakingArr} = this.state;
                  console.log('shakingArr');
      console.log(nextProps);
      if(shakingArr.length != nextProps.gamesList.hotRecommend.length){
            const length = nextProps.gamesList.hotRecommend.length;
            const shakingArr = Array.from({length}, (v,i) => ({index:i, shaking:false}))
            console.log(shakingArr);
            this.setState({shakingArr})
      }
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
            label: 'Select a sport...',
            value: null,
            color: '#9EA0A4',
        };
    const {gamesList, toggleLike, deleteItem, toTop} = this.props;
    const {shakingArr} = this.state;
    console.log(gamesList);
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

    const newProduct = (
          <View style={{width:width*.5, height:200}}>
                 <RNPickerSelect
                    placeholder={placeholder}
                    items={sports}
                    onValueChange={(value) => {
                        this.setState({
                            favSport1: value,
                        });
                    }}
                    style={pickerSelectStyles}
                    value={this.state.favSport1}
                    useNativeAndroidPickerStyle={false}
                />

          </View>    
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
               <TouchableWithoutFeedback><View style={{flex:1, backgroundColor:'#8F6FB9', justifyContent:'center', alignItems:'center', borderRightWidth:1, borderRightColor:'#6FAAB9'}}><Text>热门推荐</Text></View></TouchableWithoutFeedback>
               <TouchableWithoutFeedback><View style={{flex:1, backgroundColor:'#8F6FB9', justifyContent:'center', alignItems:'center', borderRightWidth:1, borderRightColor:'#6FAAB9'}}><Text>新款上市</Text></View></TouchableWithoutFeedback>
               <TouchableWithoutFeedback><View style={{flex:1, backgroundColor:'#8F6FB9', justifyContent:'center', alignItems:'center', borderRightWidth:1, borderRightColor:'#6FAAB9'}}><Text>我的收藏</Text></View></TouchableWithoutFeedback>
            </View>       
            {newProduct}
            {/*<View style={{width: width*.333, height:width*.4,backgroundColor:'yellowgreen'}}>
                <Image source={require('../imgs/qq1.jpg')} style={{width: width*.333, height:width*.333}}/>
                <Text style={{display:'flex',width: width*.333, height:.067*width, justifyContent:'center', alignItems:'center'}}>植物大战僵尸</Text>
            </View>
            <View style={{width: width*.333, height:width*.4,backgroundColor:'yellowgreen'}}>
                <Image source={require('../imgs/qq3.jpg')} style={{width: width*.333, height:width*.333}}/>
                <Text style={{display:'flex',width: width*.333, height:.067*width, justifyContent:'center', alignItems:'center'}}>植物大战僵尸</Text>
            </View>*/}
       </View>    
    )
  }
}

function mapStateToProps (state) {
  return {
     gamesList: state.people.gamesList
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
    
  }
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