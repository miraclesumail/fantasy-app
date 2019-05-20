/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, TextInput, AsyncStorage, Dimensions, TouchableWithoutFeedback, AppState} from 'react-native';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const widths = Dimensions.get('window').width;

class Music extends Component{
  constructor(props) {
    super(props);
    this.state = {name: '', phone: '', play: false, sound: null, appState: AppState.currentState};
  }

  componentDidMount(){
    var _that = this;
    AppState.addEventListener('change', this._handleAppStateChange)
    //需要查询的键值
    var keys = ["name","phone"];
    //根据键数组查询保存的键值对
    AsyncStorage.multiGet(keys, function(errs, result){
      //如果发生错误，这里直接返回（return）防止进入下面的逻辑
      if(errs){
        return;
      }
      //得到的结果是二维数组（result[i][0]表示我们存储的键，result[i][1]表示我们存储的值）
      _that.setState({
        name: (result[0][1]!=null)?result[0][1]:'',
        phone: (result[1][1]!=null)?result[1][1]:''
      });
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App State: ' + 'App has come to the foreground!');
      //alert('App State: ' + 'App has come to the foreground!');
    }
    //alert('App State: ' + nextAppState);
    this.setState({ appState: nextAppState });
  };

  save() {
      var keyValuePairs = [['name', this.state.name], ['phone', this.state.phone]];
      AsyncStorage.multiSet(keyValuePairs, function(errs){
          if(errs){
            //TODO：存储出错
            return;
          }
          alert('数据保存成功!');
      });
  }

  clear() {
    var _that = this;
    AsyncStorage.clear(function(err){
      if(!err){
        _that.setState({
          name: "",
          phone: ""
        });
        alert('存储的数据已清除完毕!');
      }
    });
  }

  play() {
       if(this.state.sound){
           if(!this.state.play){
               const volume = this.state.sound.getVolume();
               this.state.sound.setVolume(volume + 0.1);
               this.state.sound.play(); 
               this.setState({play:true})
           }else{
               this.state.sound.pause(); 
               this.setState({play:false})  
           }          
       }else{
           const sound = new Sound('http://link.hhtjim.com/xiami/1772908502.mp3', null, error => {  
             sound.setCurrentTime(20);
             console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());

             //sound.setVolume(0.5); 
             sound.setNumberOfLoops(-1);
             // 这个函数是播放完整首歌后调用
             sound.play((success) => {
                    alert('play end')
             }); 
             this.setState({play:true})                    
           })        
           this.setState({sound})
       }     
  }

  render() {
    const {getPeople} = this.props;  
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='yellow' hidden={true} translucent barStyle={'dark-content'} />
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.welcome} onPress={getPeople}>Welcome to React Native!</Text>
         <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Detail')}
        >Go to Music</Text> 

        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Scroll')}
        >Go to Scroll</Text> 

         <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('ModalTest')}
        >Go to Ticker</Text> 

        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
            <Text style={styles.buttonText}>
              Sign in with Facebook
            </Text>
        </LinearGradient>

        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
            <Text style={styles.buttonText} onPress={() => this.props.navigation.navigate('May')}>
              Sign in with Facebook
            </Text>
        </LinearGradient>
         
        <TouchableWithoutFeedback onPress={this.play.bind(this)}>
            <View style={{width:100, height:50, backgroundColor:'pink', justifyContent:'center', alignItems:'center'}}>
                <Text style={{color: 'yellow'}}>{this.state.play? '暂停' : '播放'}</Text>
            </View>
        </TouchableWithoutFeedback>

         <View style={styles.flex}>
          <View style={styles.row}>
            <View style={styles.head}>
              <Text style={styles.label}>姓名</Text>
            </View>
            <View style={styles.flex}>
              <TextInput style={styles.input}
                value={this.state.name}
                onChangeText={(name) => this.setState({name})}/>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.head}>
              <Text style={styles.label}>电话</Text>
            </View>
            <View style={styles.flex}>
              <TextInput style={styles.input}
                value={this.state.phone}
                onChangeText={(phone) => this.setState({phone})}/>
            </View>
          </View>
          <View style={styles.row}>
              <Text style={styles.btn} onPress={this.save.bind(this)}>保存</Text>
              <Text style={styles.btn} onPress={this.clear.bind(this)}>清除</Text>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps (state) {
  return {
    people: state.people
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getPeople: () => dispatch({type: 'changePeople', people: 'qqqqqq'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Music);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
   linearGradient: {
    height:100,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  flex:{
    flex: 1,
  },
  row:{
    flexDirection:'row',
    height:45,
    width: .8*widths,
    marginBottom:10
  },
  head:{
    width:70,
    marginLeft:5,
    backgroundColor:'#23BEFF',
    height:45,
    justifyContent:'center',
    alignItems: 'center'
  },
  label:{
    color:'#fff',
    fontSize:15,
    fontWeight:'bold'
  },
  input:{
    height:45,
    borderWidth:1,
    marginRight: 5,
    paddingLeft: 10,
    borderColor: '#ccc'
  },
  btn:{
    flex:1,
    backgroundColor:'#FF7200',
    height:25,
    textAlign:'center',
    color:'#fff',
    marginLeft:5,
    marginRight:5,
    lineHeight:25,
    fontSize:15,
  }
});
