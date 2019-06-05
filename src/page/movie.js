/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Dimensions, ART, Animated} from 'react-native';
import { connect } from 'react-redux'
import { createTransition, FlipX } from 'react-native-transition';
import Pure from '../components/pure'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const Transition = createTransition(FlipX);

const STAR = 'M 0.000 10.000 L 11.756 16.180 L 9.511 3.090 L 19.021 -6.180 L 5.878 -8.090 L 0.000 -20.000 L -5.878 -8.090 L -19.021 -6.180 L -9.511 3.090 L -11.756 16.180 L 0.000 10.000'

const {Surface, Group, Shape, Transform, Path} = ART;
const AnimatedShape = Animated.createAnimatedComponent(Shape);

const degreeToAngle = (degree) => Math.PI/180*degree;

// 使用Path生成 扇形  注意React.fragment的使用
function circlePathRender(beginAngle, endAngle, radius) {
  const rx = 50, ry = 50;
  const [lx, ly] = [rx + radius*Math.sin(degreeToAngle(beginAngle)), ry - radius*Math.cos(degreeToAngle(beginAngle))];

  const [ex, ey] = [rx + radius*Math.sin(degreeToAngle(endAngle)), ry - radius*Math.cos(degreeToAngle(endAngle))];
  
  var path = Path()
            .moveTo(lx,ly)
            .arc(ex-lx, ey-ly, radius)
            .close();

  var path1 = Path()
              .moveTo(lx,ly)
              .lineTo(rx,ry).lineTo(ex,ey)
              .close();

  // 构造而成的path可以直接复制给d属性
  return (
      <React.Fragment>
         <Shape d={path} fill={'green'}/>
         <Shape d={path1} fill={'green'}/>
      </React.Fragment>
  )

      
}

// 绘制文字
function textRender() {
  const {Text} = ART;
  return (
    <Text
      font={`bold 13px "Helvetica Neue", "Helvetica", Arial`}
      fill="#749"
      x={110}
      y={110}
    >
      Lorem ipsum dolor sit amet
    </Text>
  );
}

export default class Movie extends Component{
  constructor (props) {
    super(props);
    this.state = {
      // 设定Animated.Value初值
      value: new Animated.Value(0),
      aa: 'ggg'
    }
    this.infiniteAnimate = this.infiniteAnimate.bind(this);
  }

  componentDidMount() {
    console.log(Dimensions.get('window').width);
    this.infiniteAnimate(); 

    setTimeout(() => {
        this.setState({aa:'eee'})
    }, 1200);
  }

  componentWillUpdate(nextProps, nextState){
      console.log(nextProps);
      console.log('will update---');
  }

   // 无限循环动画
  infiniteAnimate () {
    Animated.timing(this.state.value, {
      duration: 1000,
      toValue: 1
    }).start(() => {
      Animated.timing(this.state.value, {
        duration: 2000,
        toValue: 0
      }).start(this.infiniteAnimate);
    });
  }

  switch(){
      Transition.show(
      <View style={{ height: 100,width:300, alignItems: 'center' }}>
        <Text>This is another view</Text>
      </View>
    )
  }

  render() {
    //const { people, isFetching } = this.props.people;
    return (
      /*<View style={styles.container}>
      </View>*/
      <View style={{ height:500,width:300, backgroundColor:'pink' }}>
         <Text style={styles.welcome}>movies  dnhorboibeipvevi</Text>
         <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Detail')}
        >Go to Movie</Text> 
        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Test')}
        >Go to Test</Text>

        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Pageone')}
        >新页面1</Text>

        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Pagetwo')}
        >新页面2</Text>

        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Rotate')}
        >新页面3</Text>

        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('PullTest')}
        >新页面4</Text>
        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('PullRefesh')}
        >下拉刷新</Text>
        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Flats')}
        >去flatlist</Text>
        <Text onPress={() => this.props.navigation.navigate('Friends')}>朋友圈</Text>
        <Pure />
        <Surface width={300} height={400}>
         {/*
            group 的x y是坐标相对起点
         */}
          <Group x={0} y={0}>
              <Shape d={"M90 90 A30 30 0 1,0 150 150 Z"} stroke="green"/>
              {circlePathRender(10,180,50)}
              {/*<AnimatedShape
                d={STAR}
                x={230}
                y={230}
                fill={"#280"}
                scale={this.state.value}
              />*/}
          </Group>

         
        </Surface>

        <Transition>
          <View style={{ height:100,width:300, backgroundColor:'yellow' }}>
            <Text>This the initial View</Text>
            <Button title="Press to Switch" onPress={this.switch} />
          </View>
        </Transition>
      </View>     
    ); 
  }
}

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
  }
});


