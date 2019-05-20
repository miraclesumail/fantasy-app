import React, {Component} from 'react';
import { StyleSheet, Text, View, Animated, Button } from "react-native";
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

const numberRange = Array(10)
  .fill()
  .map((x, i) => i);

const getPosition = (value, height) => parseInt(value, 10) * height * -1;

const getTranslateStyle = position => ({
  transform: [
    {
      translateY: position,
    }
  ]
})

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class Tick extends Component {
    componentWillMount() {
        this.animation = new Animated.Value(getPosition(this.props.value, this.props.height));
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.value != prevProps.value) {
           Animated.timing(this.animation, {
             toValue: getPosition(this.props.value, this.props.height),
             duration: 500,
             useNativeDriver: true,
           }).start();
        }
    }

    render() {
        const transformStyle = getTranslateStyle(this.animation)

        return (
             <Animated.View style={transformStyle}>
                {numberRange.map(v => {
                    return (
                        <Text key={v} style={styles.text}>
                        {v}
                        </Text>
                    );
                })}
            </Animated.View>
        )
    }
}

export default class Ticker extends Component {
     state = {
        measured: false,
        height: 0,
        value1: 0,
        value2: 1,
        value3: 9
     };
 
     componentDidMount() {
         this.timer = setInterval(() => {
            this.setState({
                value1: getRandom(0, 9),
                value2: getRandom(0, 9),
                value3: getRandom(0, 9),
            })
          }, 1000)
     }

     componentWillUnmount() {
         clearInterval(this.timer)
     }

     handleLayout = e => {
        this.setState({
        measured: true,
        height: e.nativeEvent.layout.height,
        });
     }

     render() {
         const {measured, height} = this.state;
         const wrapStyle = measured ? {height, opacity:0} : styles.measured

         return (
            <View style={styles.container}>
                <ScrollableTabView
                    style={{marginTop: 0}}
                    initialPage={1}
                    tabBarActiveTextColor={'pink'}
                    tabBarUnderlineStyle={{height:2, backgroundColor:'orange'}}
                    onChangeTab = {({i, ref}) => {}}
                    scrollWithoutAnimation={false}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    <View tabLabel='Tab fff#1' style={styles.topTab}>
                       <View style={{width:300,height:300,backgroundColor:'grey'}}>
                               <Text>press</Text>
                       </View>
                    </View>
                    <View tabLabel='Tab ffff#2' style={styles.topTab}>
                         <Text>favorite11</Text>
                    </View>     
                    <View tabLabel='Tab #3' style={styles.topTab}>
                         <Text>favorite22</Text>
                    </View>
                    <View tabLabel='Tab #4' style={styles.topTab}>
                         <Text>favorite33</Text>
                    </View>
                    <View tabLabel='Tab #5' style={styles.topTab}>
                          <Text>favorite44</Text>
                    </View>
                   
                </ScrollableTabView>
                <View style={[styles.row, wrapStyle]}>
                <Tick 
                    value={this.state.value1}
                    height={height}
                />
                <Tick 
                    value={this.state.value2}
                    height={height}
                />
                <Tick 
                    value={this.state.value3}
                    height={height}
                />
                </View>
                <Text style={[styles.text, styles.measure]} onLayout={this.handleLayout}>
                  0
                </Text>
            </View>
        );
     }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
  },
  measure: {
    opacity: 0,
  },
  row: {
    overflow: "hidden",
    flexDirection: "row",
  },
  topTab: {
    width:80
  },
  text: {
    fontSize: 80,
    color: "#333",
    textAlign: 'center',
  },
});