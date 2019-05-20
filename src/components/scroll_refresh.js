import React, { Component, useState, useRef, PureComponent, useEffect } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, Animated, PanResponder, TouchableWithoutFeedback, Easing} from 'react-native'
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
              {name:'阴天快乐', url: 'http://link.hhtjim.com/xiami/1772908502.mp3'}, 
              {name:'光年之外', url: 'http://link.hhtjim.com/xiami/1795428369.mp3'},
              {name:'平凡之路', url: 'http://link.hhtjim.com/xiami/1804804828.mp3'},
              {name:'刀剑如梦', url: 'http://link.hhtjim.com/xiami/80738.mp3'},
              {name:'一曲相思', url: 'http://link.hhtjim.com/xiami/1807469969.mp3'},
          ],
          lastPlayIndex: null,
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
        //    if(value > width - 30){
        //        this._value = width - 30;
        //        console.log('axiba--');
        //        this.animatedValue.setValue(width - 30);
        //        return;
        //    }
        //    this.progressWidth.setValue()
        //    this._value = value;
      })

      this.progressWidth.addListener(({value}) => {
           this._value = value;
           this.animatedValue.setValue(value - 30);
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
              this.progressAnimation.stop();         
          },
          onPanResponderMove: (evt, gestureState) => {
                  console.log('gegegge');
                  console.log(gestureState.vx + 'ddddd');
                  if(this._value >= width  && gestureState.vx > 0) return;
                  Animated.event([null, { dx: this.progressWidth}])(evt, gestureState);
          },
          onPanResponderRelease: (evt, gestureState) => {
              console.log('release');
              //console.log(this.animatedValue.toValue + 'dddddd');
              //this.progressWidth.setValue(this._value);
              //this.animatedValue.flattenOffset(); 
              this.progressWidth.flattenOffset(); 
              console.log(this._value);
              const duration = this.state.totalTime*(1 - this._value/width)*1000;
              console.log(duration);
              this.progressAnimation = Animated.timing(this.progressWidth, {
                    toValue: width,
                    duration,
                    easing: Easing.linear
              })
              clearInterval(this.timer);
              this.setCurrent(parseInt(this.state.totalTime*this._value/width));
              this.setState({hasPlayed: parseInt(this.state.totalTime*this._value/width)});
              this.startCount();
              this.progressAnimation.start(() => {console.log('finish')});
            //   clearInterval(this.anotherTimer);
            //   this.setState({nowSecond: parseInt(this._value/width*this.state.totalSecond)})
          }
      })

      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => this.shouldBeTheResponder(evt),
          onMoveShouldSetPanResponder: (evt, gestureState) => this.shouldBeTheResponder(evt),
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

      this._panResponder1 = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,         
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => {
               clearInterval(this.timer);
               this.timer = null;
               this.axiba = true;
               console.log('------fffffff');
               this.progress = Math.floor(this.state.hasPlayed/this.state.totalTime*240);         
          },
          onPanResponderMove: (evt, gestureState) => {
               console.log('move');
               console.log(gestureState.dx);
               this.progress = this.progress + gestureState.dx;
               console.log(this.progress);
          },
          onPanResponderRelease: (evt, gestureState) => {
               console.log('release')
               this.axiba = false;
               this.setState({hasPlayed: Math.floor(this.progress/240*this.state.totalTime)});
               this.state.sound.setCurrentTime(Math.floor(this.progress/240*this.state.totalTime));
               this.startCount();
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
    //   this.anotherTimer = setInterval(() => {
    //        let {nowSecond, totalSecond} = this.state;
    //        if(nowSecond == totalSecond){
    //            clearInterval(this.anotherTimer);
    //            this.anotherTimer = null;
    //            return
    //        }
    //        this.setState({nowSecond: ++nowSecond});
    //   }, 1000);
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

  play = (index) => {
       this.setState({lastPlayIndex: index});
       if(this.state.sound && this.state.lastPlayIndex == index){
           if(!this.state.play){
               this.state.sound.play(); 
               this.startCount();
               this.setState({play:true})
           }else{
               this.state.sound.pause(); 
               clearInterval(this.timer);
               this.setState({play:false})  
           }          
       }else{
           this.setState({hasPlayed: 0})
           this.setState({loading: true})
           if(this.state.sound) {
               clearInterval(this.timer);
               this.state.sound.stop();
               this.state.sound.release();
               this.setState({sound: null})          
               this.setState({play:false})  
           }  
           const sound = new Sound(this.state.songs[index].url, null, error => {  
             sound.setNumberOfLoops(-1);
             sound.play((success) => {
                    alert('play end')
             }); 
             console.log(sound.getDuration());
             this.setState({totalTime: Math.floor(sound.getDuration())})
             this.startCount();
             this.setState({loading: false})
             this.setState({play:true})  
             this.setState({sound})          
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

  renderProgress = () => {
      if(this.state.hasPlayed && this.state.totalTime) { 
          const {hasPlayed, totalTime} = this.state;
          const width = !this.axiba ? Math.floor(hasPlayed/totalTime*240) : parseInt(this.progress);
          const left = width - 8;
          return <View style={styles.loadingbar}><View style={[styles.progress, {width}]}></View><View {...this._panResponder1.panHandlers} style={[styles.indicator, {left}]}></View></View>
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
      if(!this.state.play) return null;
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
    const {nowSecond, totalSecond, refreshStatus} = this.state;
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

                <View style={[styles.content, {justifyContent: 'flex-start'}]}>
                     {
                         this.state.songs.map((item, index) => (
                            <TouchableWithoutFeedback onPress={() => this.play(index)}>
                                <View style={styles.song}>
                                    {
                                       this.state.lastPlayIndex == index ? <Text style={{color: 'red'}}>{item.name}</Text> : <Text>{item.name}</Text> 
                                    }
                                    {this.playInfo(index)}
                                    {this.state.lastPlayIndex == index ? this.renderProgress() : null}
                                    {this.state.lastPlayIndex == index ? this.renderClock() : null}
                                </View>
                            </TouchableWithoutFeedback>   
                         ))    
                     }

                     <View style={styles.test} onLayout={this.progressOnLayout}>
                           <Animated.View style={[styles.going, {width:this.progressWidth}]}></Animated.View>
                           <Animated.View style={[styles.anotherCircle, {left: this.animatedValue}]} {...this._panResponderq.panHandlers}></Animated.View>
                     </View>
                </View>

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
    },
    test: {
        height: 60,
        width,
        backgroundColor: 'grey',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative'
    },
    going: {
        height: 30,
        backgroundColor: 'orange'
    },
    anotherCircle: {
        position: 'absolute',
        width: 30, 
        height: 30,
        borderRadius: 30,
        top:15,
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
        height
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
        width:50,
        height:30,
        right:20,
        bottom:10,
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
