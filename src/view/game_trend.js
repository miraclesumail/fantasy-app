import React, { Component, Fragment } from 'react'
import { Text, View, Dimensions, StyleSheet, Animated, ScrollView, FlatList } from 'react-native'

const { width, height } = Dimensions.get("window");

const redBalls = Array.from({length:20}, (ele, index) => ('0' + (index+1)).slice(-2))

const qishu = Array.from({length:40}, (ele, index) => ('0' + (index+1)).slice(-2))

const trendDatas = Array.from({length:40}, (ele, index) => {
      return Array.from({length:20}, (item, index) => Math.random()*26 | 0)
})

class GameTrend extends Component {
   static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      headerTitle: <View style={{marginLeft:100}}><Text>双色球</Text></View>,
      /* These values are used instead of the shared configuration! */
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor,
        justifyContent:'center',
        alignItems:'center',
        width,
        height: 40
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor
    };
  };



  render() {
    const horizontal = <Fragment>
        {
            redBalls.map(item => (
                <View style={styles.topCell}><Text>{item}</Text></View>
            ))
        }
    </Fragment>

    const vertical = <Fragment>
        {
            qishu.map(item => (
                <View style={styles.verticalCell}><Text>{item}</Text></View>
            ))
        }
    </Fragment>

    const headStyle = {
          width: .1*width,
          totalWidth: 1.4*width,
          totalHeight: 1210
    }

    return (
      <View>
           <ScrollBoth headStyle={headStyle} headTitle={'期号'} horizontal={horizontal} vertical={vertical}/>
      </View>
    )
  }
}

function TrendLine({item, index}) {
    return <View style={{width: 1.4*width, height:30, flexDirection:'row'}}>
              {
                  item.map(ele => (
                      <View style={[styles.itemCell, {backgroundColor: index % 2 ? '#c3c3c3':'#ffffff'}]}><Text>{ele}</Text></View>
                  ))
              }
        </View>
}

class ScrollBoth extends Component {
      constructor(props){
          super(props);

          this.state = {}

          this._animatedValue = new Animated.ValueXY;
          this.animatedLeft = new Animated.Value(0);
          this.animatedTop = new Animated.Value(0);
          this._value = {x:0, y:0}

          this.onScroll = Animated.event([
                {nativeEvent: {contentOffset: {x: this._animatedValue.x}}}
          ])

          this.onScroll1 = Animated.event([
                {nativeEvent: {contentOffset: {y: this._animatedValue.y}}}
          ])

          this._animatedValue.addListener(value => {
              this._value = value;
              this.animatedLeft.setValue(-value.x);
              this.animatedTop.setValue(-value.y);
          })
      }

      _keyExtractor = (item, index) => index + "qq";
  
      render(){
          const { headStyle, totalWidth, headTitle, horizontal, vertical } = this.props;
            
          const transformStyle = {
              transform: [
                  {translateX: this.animatedLeft}
              ]
          }

          const transformStyle1 = {
                transform: [
                    {translateY: this.animatedTop}
                ]
          }  
          return (  
            <Fragment>  
               <View style={styles.topLine}>
                    <View style={{width:headStyle.width, height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#5DB4E8'}}>
                            <Text>{headTitle}</Text>
                    </View>
                
                    <View style={{width:width - headStyle.width, height:40, overflow:'hidden'}}>
                            <Animated.View style={{width:headStyle.totalWidth, height:40, flexDirection: 'row', ...transformStyle}}>
                                   {horizontal}
                            </Animated.View>
                    </View>
                </View>

                <View style={{width, height:height - 70, backgroundColor:'yellowgreen', flexDirection:'row'}}>
                      <View style={{width:headStyle.width, height:height - 70, backgroundColor:'yellow', overflow:'hidden'}}>
                          <Animated.View style={{width:headStyle.width, height:headStyle.totalHeight, ...transformStyle1}}>
                                    {vertical}
                          </Animated.View>
                      </View>
                      <ScrollView style={{width:width - headStyle.width, height:height - 70}} onScroll={this.onScroll1} >
                           <View style={{width:width - headStyle.width, height:headStyle.totalHeight}}>
                               <ScrollView horizontal={true} onScroll={this.onScroll} >
                                  <View style={{width:headStyle.totalWidth, height:headStyle.totalHeight, flexDirection:'row'}}>
                                        <FlatList 
                                            initialNumToRender={20}
                                            data={trendDatas}
                                            renderItem={({ item, index }) => <TrendLine item={item} index={index}/>}
                                            keyExtractor={this._keyExtractor}
                                            extraData={this.state}
                                        />
                                   </View> 
                                </ScrollView> 
                           </View>                         
                      </ScrollView>    
                </View>
              </Fragment>   
          )
      }
}

const styles = StyleSheet.create({
      topLine: {
            width, 
            height:40, 
            flexDirection:'row'
      },
      topCell: {
            width: .07*width,
            height: 40,
            backgroundColor:'chocolate',
            justifyContent: 'center',
            alignItems: 'center'
      },
      itemCell: {
            width: .07*width,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor:'grey'
      },
      verticalCell: {
            width: .1*width,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center'
      }
})

export default GameTrend