/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Animated, Easing, Vibration, ActivityIndicator, Dimensions, FlatList, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import RNShakeEvent from 'react-native-shake-event';
import { SearchBar } from 'react-native-elements';
import * as _ from 'lodash'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const widths = Dimensions.get('window').width;

class MyListItem extends React.PureComponent {

  _animated = new Animated.Value(1);


  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  onRemove = () => {
    // const { onRemove } = this.props;
    // if (onRemove) {
    //   Animated.timing(this._animated, {
    //     toValue: 0,
    //     duration: 250,
    //   }).start(() => onRemove());
    // }
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    const rowStyles = [
      {
        height: this._animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 70],
          extrapolate: 'clamp',
        }),
      },
      { opacity: this._animated },
      {
        transform: [
          { scale: this._animated },
          {
            rotate: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: ['35deg', '0deg'],
              extrapolate: 'clamp',
            })
          }
        ],
      },
    ];
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Animated.View style={[styles.listItem, rowStyles]}>
          <Text style={{color: textColor}}>{this.props.title}</Text>
         <TouchableWithoutFeedback onPress={this.onRemove}>
            <Text style={{color:'green'}}>delete</Text>
         </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends Component {
  state = {selected: new Map(), loading:false, refreshing:false};

  _keyExtractor = (item, index) => item.title;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: .86*widths,
          backgroundColor: "yellow",
          left: .14*widths
        }}
      />
    );
  };

  _renderItem = ({item}) => {
      const {removeItem} = this.props;  
      return(
           <MyListItem
            id={item.id}
            onPressItem={this._onPressItem}
            selected={!!this.state.selected.get(item.id)}
            title={item.title}
            onRemove = {() => {
                removeItem(item.id)
            }}
            />
      )     
  }
    

  onEndReached = () => {
      this.setState({
              loading: true
         })
      setTimeout(() => {
         this.props.loadMore();
         this.setState({
              loading: false
         })
      },1000)   
  }

  alert(){
      this.setState({
          refreshing: true
      })
      alert('refreshing')
  }    

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onEndThreshold={100}
        onEndReached={this.onEndReached}
        refreshing={this.state.refreshing}
        onRefresh={this.alert.bind(this)}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

export default class MusicDetail extends Component{
   constructor(props){
       super(props);
       this.state = {
            count: 0,
            lotteryInfo:[
              {title:'重庆时时彩',number:'03 05 06 07 08 11', open:false, content: 'wwwwwwww'},
              {title:'江西时时彩',number:'03 05 06 07 08 11', open:false, content: 'ffffffff'},
              {title:'新疆时时彩',number:'03 05 06 07 08 11', open:false, content: 'dddddddd'},
              {title:'天津时时彩',number:'03 05 06 07 08 11', open:false, content: 'gggggggg'}
            ],
            animatedValue: [
                new Animated.Value(0),
                new Animated.Value(0),
                new Animated.Value(0),
                new Animated.Value(0)
            ],
            data:[
                {id:1, title:'qqqqq11'},
                {id:2, title:'wwwww22'},
                {id:3, title:'eeeee33'},
                {id:4, title:'eeeee44'},
                {id:5, title:'eeeee55'},
                {id:6, title:'eeeee66'},
                {id:7, title:'eeeee77'},
                {id:8, title:'eeeee88'},
                {id:9, title:'eeeee99'},
            ]
       }
   }

   componentDidMount() {
      //  this.animatedValue = new Animated.Value(0);

       RNShakeEvent.addEventListener('shake', _.throttle(() => {
           let count = this.state.count + 1;
           this.vibration();
           this.setState({
               count
           })
       }, 1000))
   }

   //点击震动
   vibration() {
      Vibration.vibrate();
   }

   removeItem = (id) => {
      let temp = this.state.data.filter((item) => item.id != id);
      this.setState({
           data: temp
      })
   }

   toggle(index) {
          if(this.state.lotteryInfo[index].open){
              Animated.timing(this.state.animatedValue[index], {
                  toValue: 0,
                  duration: 1000,
                  easing: Easing.bounce
              }).start(); 
              this.changeIndex(index);
          }else{
              Animated.timing(this.state.animatedValue[index], {
                  toValue: 80,
                  duration: 1000,
                  easing: Easing.bounce
              }).start(); 
              this.changeIndex(index);
          }  
   }

   changeIndex(index){
        let temp = this.state.lotteryInfo.map((item, order) => {
           if(order == index)
              return {...item, open: !item.open}
           else
              return item   
            })
            this.setState({
                lotteryInfo: temp
            })
   }

   more(){
      this.setState({
          data: [...this.state.data, {id:3, title:'feefwef'}]
      })   
   }
  render() { 

    return (
      <View style={styles.container}>   
         <Text style={styles.welcome} onPress={this.vibration.bind(this)}>this is MusicDetail {this.state.count}</Text>
         {
             this.state.lotteryInfo.map((item, index) => (
                <View key={index}>
                      <TouchableWithoutFeedback onPress={() => this.toggle(index)}>
                          <View style={styles.title}>
                                <Text>{item.title}</Text>
                                <Text>{item.number}</Text>
                          </View>
                      </TouchableWithoutFeedback>
                      <Animated.View style={[styles.content,{height: this.state.animatedValue[index]}]}><Text>{item.content}</Text></Animated.View>
                </View>
             ))
         }

         <MultiSelectList data={this.state.data} loadMore={this.more.bind(this)} removeItem={(id) => {this.removeItem(id)}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  title: {
    width: widths,
    height: 40,
    backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor:'blue'
  },
  content: {
    width: widths,
    backgroundColor: 'green',
    justifyContent: 'center',
    overflow: 'hidden'
   // transition: `transform ${300}ms ease-in-out, height ${800}ms ease-in-out`,
  },
  listItem: {
      width: widths,
      //height:70,
      backgroundColor:'#c3c3c3'
  }
 
});
