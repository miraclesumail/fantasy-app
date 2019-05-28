import React, { Component, useState, useRef, PureComponent, useEffect } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, Animated, PanResponder, Image, TouchableWithoutFeedback, Easing} from 'react-native'
import Sound from 'react-native-sound';
import { connect } from 'react-redux';
// 1795428369  1772908502  http://link.hhtjim.com/xiami/1772908502.mp3
const {height, width} = Dimensions.get('window');
const circles = [0, 1, 2];
const colors = ['yellow', 'green', 'blue'];
class Circles extends Component {
    constructor(props){
        super(props);
        this.state = {
            count: 0  
        }

        this.timer = null;
    }
    
    componentDidMount() {
         this.timer = setInterval(() => {
              if(this.state.count == 3){
                 this.setState({count:0})
              }else{
                 let {count} = this.state;
                 this.setState({count: ++count})
              }
         }, 300)
    }

    componentWillUnmount() {
         clearInterval(this.timer);
    }

    renderCircle = () => {
         let count = this.state.count;
         const load = Array.from({length: count}).map((item,index) => {
                 return (
                         <View style={[styles.dot, {backgroundColor: colors[index]}]}> 
                         </View>
                       )
             }   
          )
          return load;
    }

    render() {   
          return (
               <View style={styles.loading}>
              {
                 this.renderCircle()
              }
               </View>    
          )
    }
}

function LoadText() {
     const colors = ['#FF1F00','#FF4D00', '#FF7300', '#FFB100'];
     const texts = ['正', '在', '加', '载'];
     let [numbers, setNumbers] = useState([0,1,2,3]), timeout;
     
     // useEffect会在componentDidMount时运行一次  re-render后也会运行 每次re-render时 先log'变化1' 后
     useEffect(() => {
       console.log('变化2');
       timeout = setTimeout(function() {
           numbers = numbers.map(ele => ele + 1);
           setNumbers(numbers);
       }, 200);
       return () => {
           console.log('变化1');
           clearTimeout(timeout);
       };
     })

     return (
         <View style={[styles.freshFooter,{flexDirection:'row', justifyContent:'center'}]}>
             {numbers.map((val,index) => (
                 <Text style={{color: colors[val%4]}}> {texts[index]} </Text>
             ))}
         </View>
     )
}

class ScrollRefresh extends Component {
  constructor(props) {
      super(props);

      this.state = {
          scrollTop:0,
          scrollEnabled: true,
          showFreshFooter: false,
          refreshStatus: 'inactive',
          pullStatus: 'inactive',
          hasLoad: 0,
          play: false,
          songs:[
              {name:'平凡之路', url: 'https://link.hhtjim.com/163/28815250.mp3', img:require('../imgs/pushu.jpg'), singer:'朴树'}, 
              {name:'光年之外', url: 'https://link.hhtjim.com/163/449818741.mp3', img:require('../imgs/ziqi.jpg'), singer:'邓紫棋'},
              {name:'刀剑如梦', url: 'https://link.hhtjim.com/163/5271860.mp3', img:require('../imgs/daojian.jpg'), singer:'周华健'},
              {name:'Thats a girl', url: 'https://link.hhtjim.com/163/440208476.mp3', img:require('../imgs/qinghuaci.jpg'), singer:'周杰伦'}
            //   {name:'一曲相思', url: 'http://link.hhtjim.com/xiami/1807469969.mp3'},
          ],
          lastPlayIndex: 0,
          totalTime: 0,
          hasPlayed: 0,
          timer: null,
          sound: null,
          loading: false,
          totalSecond:60,
          nowSecond:0
      }
      this._animatedValue = new Animated.Value(0);
      this._animatedBot = new Animated.Value(0);
      this.progressWidth = new Animated.Value(0);
      this.progress = 0;
      this.timer = null;
      this.axiba = false;
      this.refreshTime = '';
      this.progressAnimation = null;

      this.anotherTimer = null;

      this.animatedValue = new Animated.Value(0);
      this.scrollHeight = 0;
      this._value = 0;
      this.pullDownHeight = 0;
      this.forbidArea = null;
      this.showFreshFooter = false;

      this._animatedValue.addListener(({value}) => {
           this.pullDownHeight = value;
           this.changeRefreshStatus();
      })

      this.progressWidth.addListener(({value}) => {
           this._value = value;
           this.animatedValue.setValue(value);
      })

      this._panResponderq = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => {
              //if(this._value == width - 30 && gestureState.dy > 0) return false; 
              return true;
          },
          onMoveShouldSetPanResponder: (evt, gestureState) => {
              return true;
          },
          onPanResponderGrant: (evt, gestureState) => {
              console.log(gestureState.dy + '=====');
              //this.animatedValue.setOffset(this._value); 
              this.progressWidth.setOffset(this._value); 
              this.progressWidth.setValue(0);
              this.progressAnimation.stop();         
          },
          onPanResponderMove: (evt, gestureState) => {
                  console.log(gestureState.vx + 'ddddd');
                  if(this._value >= width - 40 && gestureState.vx > 0) return;
                  Animated.event([null, { dx: this.progressWidth}])(evt, gestureState);
          },
          onPanResponderRelease: (evt, gestureState) => {
              this.progressWidth.flattenOffset(); 
              const {hasPlayed, totalTime} = this.state;
              
            //   if(hasPlayed/totalTime > this._value/(width - 40)){
            //       console.log('实际上就是就是解决实际上就是');
            //       this.progressWidth.setOffset(0);
            //       this.progressWidth.setValue(hasPlayed/totalTime*(width - 40));
            //   }
              const duration = this.state.totalTime*(1 - this._value/(width - 40))*1000;
              console.log(duration);
              this.progressAnimation = Animated.timing(this.progressWidth, {
                    toValue: width - 40,
                    duration,
                    easing: Easing.linear
              })
              clearInterval(this.timer);
              this.setCurrent(parseInt(this.state.totalTime*this._value/(width - 40)));
              this.setState({hasPlayed: parseInt(this.state.totalTime*this._value/(width - 40))});
              this.startCount();
              if(this.state.sound && !this.state.play){
                  this.play(this.state.lastPlayIndex)
              }else{
                  this.progressAnimation.start(() => {console.log('finish')});
              }
            //   this.setState({nowSecond: parseInt(this._value/width*this.state.totalSecond)})
          }
      })

      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => this.shouldBeTheResponder(evt),
          onMoveShouldSetPanResponder: (evt, gestureState) => this.shouldBeTheResponder(evt) && !(gestureState.dx === 0 && gestureState.dy === 0)  ,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
          onPanResponderGrant: (evt, gestureState) => {
               if(this.state.scrollTop) return 
               console.log('------')         
          },
          onPanResponderMove: (evt, gestureState) => {
               if(gestureState.dy > 100 || this.state.pullStatus == 'active') return 
               const {showFreshFooter} = this.state;
               if(gestureState.dy < -100) {
                   this.setState({pullStatus: 'active'});
                   this.pullUpReleaseHnadler(true);
               }
               
               console.log('asdswss');
               console.log(gestureState.dy);

               // 上拉达到一定距离
               if(gestureState.dy < -50 && !showFreshFooter) {
                   this.setState({showFreshFooter: true});
               }    
               this._animatedValue.setValue(gestureState.dy)  
          },
          onPanResponderRelease: (evt, gestureState) => {
               console.log('release');
               // 根据scrollTop 判断是下拉刷新 还是上啦加载
               if(this.pullDownHeight > 0){
                    this.pullDownReleaseHnadler();       
               } else {
                    if(this.state.pullStatus != 'active')
                       this.pullUpReleaseHnadler(false);
               }
               
          }
      }) 
  }
  
  componentDidMount() {
      console.log(width, 'pppp---ppppp');
      //this.startKill();
  }
  
  // panderMove判断刷新状态
  changeRefreshStatus = () => {
      console.log('judge refresh status');
      if(this.state.refreshStatus == 'inactive' && this.pullDownHeight >= 30) {
             this.setState({refreshStatus: 'active'})
      }

      if(this.state.refreshStatus == 'active' && this.pullDownHeight < 30) {
             this.setState({refreshStatus: 'inactive'});
      }
  }

  // 判断pand是否要作出相应
  shouldBeTheResponder = (evt) => {
      const flag = evt.nativeEvent.pageY < this.forbidArea[0] || evt.nativeEvent.pageY > this.forbidArea[1];
      const [scrollHeight, height] = [Math.floor(this.scrollHeight), Math.floor(height)];
      const anotherFlag = this.state.scrollTop == 0 || this.state.scrollTop == scrollHeight - 100 - height;
      const {pullStatus} = this.state;
      return anotherFlag && flag && pullStatus !== 'active';  
  }

  /**
   *  1. 第一刷新 refreshing的时候显示 正在刷新
   *  2. 不是第一次 显示上次刷新的时间
   *  3. 没有达到下拉刷新的距离 显示文字
   */
  getRereshText = (refreshStatus) => {
     const {refreshTime} = this.props.people;
     if(refreshStatus == 'refreshing') {
         return refreshTime ? `上次刷新${refreshTime}` : '正在刷新';
     }else {
         return refreshStatus == 'inactive' ? '下拉刷新' : '松开刷新';
     }  
  }

  // 下拉刷新释放处理
  pullDownReleaseHnadler = () => {
        this.setState({scrollEnabled: false});

        // 下拉距离不够
        if(this.pullDownHeight < 30) {
              Animated.timing(this._animatedValue, {
                    toValue: 0,
                    duration: 300
              }).start(() => {
                    console.log('finish')
                    this.setState({scrollEnabled: true});
              })
        }else {
              this.setState({refreshStatus: 'refreshing'});
              this.refreshTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
              Animated.timing(this._animatedValue, {
                        toValue: 50,
                        duration: 800
              }).start(() => {
                        console.log('finish')
                        // 请求接口
                        this.showLoading();
              })
        }
  }

  // 下拉刷新释放处理
  pullUpReleaseHnadler = (flag) => {
      const {songs} = this.state;
      if(!flag) {
            this.setState({showFreshFooter: false});
            Animated.timing(this._animatedValue, {
                    toValue: 0,
                    duration: 800
            }).start(() => {
                    console.log('finish')
            })
      } else {
           setTimeout(() => {
               songs.push(songs[Math.floor(Math.random()*songs.length)]);
               this.setState({songs});
               this.setState({showFreshFooter: false});
               Animated.timing(this._animatedValue, {
                    toValue: 0,
                    duration: 800
               }).start(() => {
                    this.setState({scrollEnabled: true});
                    this.setState({pullStatus: 'inactive'});
                    console.log('finish');
               })
           }, 2000);
      }
  }

  startKill = () => {
         this.progressAnimation = Animated.timing(this.progressWidth, {
              toValue: width,
              duration: this.state.totalTime*1000,
              easing: Easing.linear
              //useNativeDriver: true
         })
         this.progressAnimation.start(() => {})
  }

  // 下拉刷新的回调  _animatedBot控制小球上下滚动5次 
  showLoading = (flag = true) => {
      Animated.timing(this._animatedBot, { 
          toValue: flag ? 30 : 0,
          duration: 500,
          delay: 200
      }).start(() => {
          let {hasLoad} = this.state;
          if(hasLoad == 5) {
              this.setState({hasLoad: 0})
              Animated.timing(this._animatedValue, {
                    toValue: 0,
                    duration: 800
               }).start(() => {
                    this.setState({scrollEnabled: true});
                    // 需要在小球上下运动5次后 再去改变redux的state
                    this.props.updateRefreshtime(this.refreshTime);
                    this.setState({refreshStatus: 'inactive'})
               })
              return 
          }
          this.setState({hasLoad: ++hasLoad})
          this.showLoading(!flag)
      })
  }

  setCurrent(time) {
      this.state.sound.setCurrentTime(time);
  }

  playNext = (num) => {
      const {lastPlayIndex, songs} = this.state;
      if(num == 1 && lastPlayIndex == songs.length - 1) return;
      if(num == -1 && lastPlayIndex == 0) return;

      this.play(lastPlayIndex + num);
  }

  play = (index) => {
       if(this.state.sound && this.state.lastPlayIndex == index){
           if(!this.state.play){
               this.state.sound.play((success) => {
                    alert('play end');
                    clearInterval(this.timer);
                    this.timer = null;
                    this.progressWidth.setOffset(0); 
                    this.progressWidth.setValue(0);
                    this.play(this.state.lastPlayIndex+1);
                  });      
               this.progressAnimation.start();
               !this.timer && this.startCount();
               this.setState({play:true})
           }else{
               this.state.sound.pause(); 
               clearInterval(this.timer);
               this.timer = null;
               this.progressAnimation.stop();
               this.setState({play:false})  
           } 
               
       }else{
           this.setState({lastPlayIndex: index});
           this.setState({hasPlayed: 0})
           this.setState({loading: true})
           this.timer && clearInterval(this.timer);
           
           if(this.state.sound) {
               this.state.sound.stop();
               this.state.sound.release();
               this.setState({sound: null});          
               this.setState({play:false});  
               this.progressWidth.setOffset(0); 
               this.progressWidth.setValue(0);
           }  
           const sound = new Sound(this.state.songs[index].url, null, error => {  
             //sound.setNumberOfLoops(-1);
             
             console.log(sound.getDuration());
             this.setState({totalTime: Math.floor(sound.getDuration())})
             this.startCount();
             this.startKill();
             this.setState({loading: false})
             this.setState({play:true})  
             this.setState({sound}, () => {
                  this.state.sound.play((success) => {
                    alert('play end');
                    clearInterval(this.timer);
                    this.timer = null;
                    this.progressWidth.setOffset(0); 
                    this.progressWidth.setValue(0);
                    this.play(this.state.lastPlayIndex+1);
                  }); 
             })          
           })        
       }     
  }

  startCount() {
      this.timer = setInterval(() => {
          this.setState({hasPlayed: this.state.hasPlayed + 1});
      }, 1000)
  }  

  playInfo(index) {
      if(this.state.lastPlayIndex == index){
          if(this.state.loading){
             return <Circles/>
          }else if(this.state.sound){
             !this.progressAnimation && this.startKill(); 
             return this.state.play ? <Text>暂停</Text> : <Text>播放</Text>
          }
      }else{
          return null
      }
  }

  progressOnLayout = (e) => {
      console.log('dddd');
      console.log(e.nativeEvent.layout);
      const {y, height} = e.nativeEvent.layout;
      this.forbidArea = [y, y + height];
  }

  scrollOnLayout = (e) => {
      const {y, height} = e.nativeEvent.layout;
      console.log(height, 'ddellele');
      this.scrollHeight = height;
  }

  renderClock() {
      //if(!this.state.play) return null;
      const minute =  ('0' + Math.floor(this.state.hasPlayed / 60)).slice(-2);
      const second =  ('0' + this.state.hasPlayed % 60).slice(-2);
      return (
          <View style={styles.clock}>
              <Text style={{color: '#000000'}}>{minute}:{second}</Text>
          </View>    
      )
  }

  renderFooter = () => {
    const {pullStatus} = this.state;
    const pullText = pullStatus == 'inactive' ? '上拉加载' : '正在加载';
    return pullStatus == 'active' ? <LoadText/> : <View style={styles.freshFooter}>
                      <Text>{pullText}</Text>
            </View>
  }

  render() {
    const {children} = this.props;  
    const transformStyle = {
        transform: [{translateY: this._animatedValue}]
    }
    const {nowSecond, totalSecond, refreshStatus, songs, lastPlayIndex} = this.state;
    const nowWidth = Math.floor(width*nowSecond/totalSecond);
    console.log(nowWidth);
    let left = parseInt(this._value);
    
    const toLeft = new Animated.Value(this._value);
    const refreshText = this.getRereshText(refreshStatus);
    
    return (
       <View style={{position:'relative', height, width}}>

       <Animated.View style={[styles.scrollBox, transformStyle]} {...this._panResponder.panHandlers}>
            <ScrollView  contentContainerStyle={styles.contentContainer} scrollEnabled={this.state.scrollEnabled} 
                onLayout={this.scrollOnLayout}
                onScroll={(e)=>{
                    console.log(e.nativeEvent.contentOffset.y);
                    this.setState({scrollTop: e.nativeEvent.contentOffset.y})
                }}>
                <View style={styles.refreshHead}>
                      <Text style={styles.refreshText}>{refreshText}</Text>
                      <Animated.View style={[styles.circle, {bottom: this._animatedBot}]}></Animated.View>
                </View>  

                
                <View style={[styles.content, {height:.7*height}]}>
                    <View style={{width:.9*width, height:200, backgroundColor:'orange'}}>
                        <Image source={songs[lastPlayIndex].img} style={{width:.9*width, height:200}}/>
                    </View>  

                    <View style={{justifyContent:'center', alignItems:'center',marginTop:20, marginBottom:5}}>
                        <Text style={{lineHeight:20, fontSize:18, fontWeight:'bold'}}>{songs[lastPlayIndex].name}</Text>
                    </View>    

                    <View style={{justifyContent:'center', alignItems:'center',marginTop:6}}>
                        <Text style={{lineHeight:18, fontSize:16, color:'#DB9037'}}>{songs[lastPlayIndex].singer}</Text>
                    </View>
                    
          
                    <View style={{flexDirection:'row', width:.6*width, height:.2*width, justifyContent:'space-between', alignItems:'center'}}>
                        <TouchableWithoutFeedback onPress={() => this.playNext(-1)}>
                             <View style={{width:.15*width, height:.1*width,justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:lastPlayIndex == 0 ? 'grey':'#DB9F37'}}>
                               <Text>上一首</Text>
                             </View>
                        </TouchableWithoutFeedback>
                       
                        <TouchableWithoutFeedback onPress={() => this.play(this.state.lastPlayIndex)}>
                            <View style={{width:.2*width, height:.2*width,justifyContent:'center', alignItems:'center', 
                             }}>
                                {this.state.loading ? <Circles/> : null}
                                <View style={{width:.1*width, height:.1*width,justifyContent:'center', alignItems:'center', 
                             backgroundColor: this.state.play ? 'chocolate' : 'grey'}}>
                                    {this.state.play ? <Text style>暂停</Text> : <Text>播放</Text>}
                                </View>         
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.playNext(1)}>
                            <View style={{width:.15*width, height:.1*width,justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:lastPlayIndex == songs.length - 1 ? 'grey':'#DB9F37'}}>
                                <Text>下一首</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.test} onLayout={this.progressOnLayout}>
                        <Animated.View style={[styles.going, {width:this.progressWidth}]}></Animated.View>
                        <Animated.View style={[styles.anotherCircle, {left: this.animatedValue}]} {...this._panResponderq.panHandlers}>
                            {this.renderClock()}
                        </Animated.View>
                    </View> 
                </View>
                
                {/*<View style={[styles.content, {justifyContent: 'flex-start'}]}>
                     {
                         this.state.songs.map((item, index) => (
                            <TouchableWithoutFeedback onPress={() => this.play(index)}>
                                <View style={styles.song}>
                                    {
                                       this.state.lastPlayIndex == index ? <Text style={{color: 'red'}}>{item.name}</Text> : <Text>{item.name}</Text> 
                                    }
                                    {this.playInfo(index)}
                                </View>
                            </TouchableWithoutFeedback>   
                         ))    
                     }           
                </View>*/}

                {/*<View style={[styles.content, {backgroundColor: 'chocolate', height:200}]}>
                      
                </View>*/}

                
            </ScrollView>   
            
            
       </Animated.View> 
        {this.state.showFreshFooter ? this.renderFooter() : null}
       </View>        
    )
  }
}

const styles = StyleSheet.create({
    scrollBox:{
        height: height + 100,
        width: width,
        position: 'absolute',
        top: -100,
        zIndex:1
    },
    contentContainer: {
        paddingTop: 0,
        alignItems:'center'
    },
    test: {
        height: 30,
        width,
        backgroundColor: 'grey',
        //marginTop: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative'
    },
    going: {
        height: 3,
        backgroundColor: 'orange'
    },
    anotherCircle: {
        position: 'absolute',
        width: 40, 
        height: 20,
        borderRadius: 10,
        //top:15,
        backgroundColor: 'pink'
    },
    refreshHead: {
        height: 100,
        backgroundColor: 'pink',
        paddingTop:30,
        position: 'relative'
    },
    refreshText: {
       position:'absolute', 
       bottom:0, 
       left:.5*width + 10
    },
    content: {
        backgroundColor:'yellowgreen',
        justifyContent: 'center',
        alignItems: 'center',
        height:50
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: 'purple',
        position: 'absolute',
        bottom: 0,
        left: .5*width - 20
    },
    song: {
        width,
        height: 50,
        backgroundColor: 'pink',
        position: 'relative',
        justifyContent: 'center',
        paddingLeft: 20,    
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    progress: {
        position: 'absolute',
        height: 8,
        backgroundColor: 'blue',
        left: 0,
        top: 0
    },
    loadingbar: {
        position: 'absolute',
        height: 8,
        width:240,
        backgroundColor: 'grey',
        left: 100,
        top: 20
    },
    dot: {
        width:10,
        height:10,
        borderRadius:10,
        marginRight:5
    },
    loading: {
        position: 'absolute',
        width:60,
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        bottom:0,
        left: 20,
    },
    indicator: {
        width:50,
        height:50,
        borderRadius: 50,
        backgroundColor: 'yellowgreen'
    },
    clock: {
        position: 'absolute',
        width:40,
        height:20,
        // right:20,
        // bottom:10,
        justifyContent: 'center',
        alignItems:'center',
    },
    freshFooter: {
        position: 'absolute',
        width,
        height: 50,
        backgroundColor:'yellow',
        bottom:40,
        zIndex:100
    }
})

function mapStateToProps (state) {
  return {
     people: state.people
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateRefreshtime: (refreshTime) => dispatch({type: 'updateRefreshTime', refreshTime})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrollRefresh)