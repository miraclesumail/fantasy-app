/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, Button, Dimensions, processColor, Image} from 'react-native';
import Music from './src/page/music'
import MusicDetail from './src/components/music_detail'
import Movie from './src/page/movie'
import MovieDetail from './src/components/movie_detail'
import ScrollTest from './src/components/scroll_test'
import BarChart from './src/components/bar_chart'
import Test from './src/components/test'
import Ticker from './src/components/ticker'
import AppDetail from './src/components/app_detail'
import CustomHeader from './src/components/custom_header'
import CommonHeader from './src/components/common_header'

import ModalTest from './src/components/modalTest'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createStackNavigator, createAppContainer, TabBarBottom, createBottomTabNavigator, DrawerItems, createDrawerNavigator } from "react-navigation";
import {LineChart} from 'react-native-charts-wrapper';
import NavigationService from './src/tool/navigation_service'
import { connect } from 'react-redux'
import TabBar from './src/components/tabbar'
import PageOne from './src/view/page_one'
import PageTwo from './src/view/page_two'
import Rotate from './src/view/rotation'
import PullTest from './src/view/pullTest'
import PullRefesh from './src/view/pullRefresh'
import May from './src/view/mayday'
import MayTwo from './src/view/mayspring'
import HomePage from './src/view/home'
import Flat from './src/view/flat'
import TestSelect from './src/view/testSelect'
import Slider from './src/view/slider'
import Friends from './src/view/friends'
import AddPost from './src/view/addPost'

Date.prototype.Format = function(fmt)   
{    
  var o = {   
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const widths = Dimensions.get('window').width;

class MyHomeScreen extends Component {
  static navigationOptions = {
      //drawerLabel: 'Home',
      drawerIcon: ({ tintColor }) => (
        <Image
          source={require('./src/imgs/qq1.jpg')}
          style={[styles.icon]}
        />
      )
  }

  render() {
    return (
      <View>
          <Button
            onPress={() => this.props.navigation.navigate('Notifications')}
            title="Go to notifications"
          />
      </View>
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    //drawerLabel: 'Notifications',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./src/imgs/qq1.jpg')}
        style={[styles.icon]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const customDrawerComponent = (props) => (
    <View  style={{width:200, backgroundColor: 'orange'}}> 
          <Image
            source={require('./src/imgs/qq2.jpg')}
            style={[styles.icons]}
          />
          <DrawerItems {...props}/>
    </View>  
)

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  }
}, {
    drawerWidth:200,
    drawerBackgroundColor: 'pink',
    contentOptions: {
       activeTintColor: 'yellowgreen',
       activeBackgroundColor: 'purple'
    },
    contentComponent: customDrawerComponent,
    defaultNavigationOptions: ({navigation}) => {
          const { routeName } = navigation.state;
          return {
              drawerLabel: routeName == 'Home' ? 'qqqqq':'wwwww'
          }
    }
});


class App extends Component{
  constructor(props) {
    super(props);
   
    this.state = {
      data: {dataSets: [{
              values: [{x: 4, y: 135}, {x: 5, y: 0.88}, {x: 6, y: 0.77}, {x: 7, y: 105}], label: 'A',
            }, {
              values: [{x: 4, y: 105}, {x: 5, y: 90}, {x: 6, y: 130}, {x: 7, y: 100}], label: 'B',
            }, {
              values: [{x: 4, y: 110}, {x: 5, y: 110}, {x: 6, y: 105}, {x: 7, y: 115}], label: 'C',
            }]},
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white'),
      }
    }  
  }

  componentDidMount() {
       setTimeout(() =>  {
        this.props.changePeople();
       }, 3000);
  }

  render() {
    const { people, isFetching } = this.props.people;
    const option = {
      title: {
          text: 'ECharts demo'
      },
      tooltip: {},
      legend: {
          data:['销量']
      },
      xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
      }]
    };
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => Alert.alert(
  'Alert Title',
  'My Alert Msg',
  [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]
)}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{people}</Text>
        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Music')}
        >Go to Music</Text> 
        <Text style={styles.btn}
                onPress={() => this.props.navigation.navigate('Detail', {
                  item:'ssssss'
                })}
        >Go to AppDetail</Text> 
         <Text style={styles.btn}
                onPress={() => NavigationService.navigate('Bar', {
                  item: 'ldldldld'
                })}
        >Go to Bar</Text> 

         <View style={styles.chartContainer}>
          <LineChart style={{flex:1, height:200}}
              data={this.state.data}  marker={this.state.marker}  borderColor={processColor('teal')}
            borderWidth={1}
          />
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

function mapDispatchToProps(dispatch) {
    return {
      changePeople: () => dispatch({ type: 'changePeople' })
    }
}

const Main = connect(
  mapStateToProps, mapDispatchToProps
)(App)

const Apps = createStackNavigator({
  Home: Main,
  Detail: AppDetail,
  Bar: BarChart
},{
   defaultNavigationOptions: {
  header: props => <CustomHeader {...props} />,
  headerStyle: {
    backgroundColor: "transparent"
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "pink",
  },
  headerTintColor: "pink",
  animationEnabled: true
  }
}
);

const Musics = createStackNavigator({
  Home: {
    screen: Music
  },
  Detail: {
    screen: MusicDetail
  },
  Scroll: {
    screen: HomePage
  },
  Ticker: {
    screen: Ticker
  },
  May: {
    screen: May
  },
  ModalTest: {
    screen: ModalTest
  },
  Drawer: {
    screen: MyDrawerNavigator
  }
},{
  defaultNavigationOptions: ({navigation}) => ({
      tabBarVisible: navigation.state.routeName == 'Detail' ? false : true,
      header: props => <CommonHeader {...props} />,
      headerStyle: {
        backgroundColor: "transparent"
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "pink",
      },
      headerTintColor: "pink",
      animationEnabled: true
    })
}
);

const Movies = createStackNavigator({
  Home: {
    screen: Movie
  },
  Detail: {
    screen: MovieDetail
  },
  Test: {
    screen: Test
  },
  Pageone: {
    screen: PageOne
  },
  Pagetwo: {
    screen: PageTwo
  },
  Rotate: {
    screen: Rotate
  },
  PullTest: {
    screen: PullTest
  },
  PullRefesh: {
    screen: PullRefesh
  },
  Flats: {
    screen: Flat
  },
  Friends: {
    screen: Friends
  },
  AddPost: {
    screen: AddPost
  }
  },
  {
  defaultNavigationOptions: {
      headerStyle: {
        //backgroundColor: '#f4511e',
        height:0,
        overflow: 'hidden'
      },
      headerTintColor: '#f5d300',
      headerTitleStyle: {
        fontWeight: 'bold',
        backgroundColor: 'pink'
      }
    }
}
);

const TabNavigator = createBottomTabNavigator({
  Musics: {
    screen: Musics
  },
  Movie: {
    screen: Movies
  },
  App: {
    screen: Apps
  }
},
 {
  //  defaultNavigationOptions: ({navigation}) => {
  //      // 如何控制stacknavigator里面的某个路由不显示tab
  //      const routes = navigation.state.routes;
  //      return {tabBarIcon: ({focused, tintColor}) => {
  //             let iconName;
  //             const {routeName} = navigation.state;
  //             if(routeName == 'Home') {
  //                   iconName = `ios-information-circle${focused? '': '-outline'}`;
  //             }else if(routeName == 'Musics') {
  //                   iconName = `ios-checkbox${focused? '': '-outline'}`;
  //             }else{
  //                   iconName = `ios-add-circle${focused? '': '-outline'}`
  //             }
  //             if(routeName == 'Musics') {
  //                return <View style={{width:.33*widths, height:80, backgroundColor:'purple'}}><Text>fddd </Text></View>
  //             }
  //             return <Ionicons name={iconName} size={25} color={tintColor} />
  //       },
  //             //tabBarVisible: routes[routes.length-1].routeName == 'Scroll' ? false : true
  //     }
        
  //  },
   tabBarComponent: props => <TabBar {...props} />,
  //  tabBarOptions: {
  //       activeTintColor: 'tomato',
  //       inactiveTintColor: 'gray',
  //  },
  //  tabBarComponent: TabBarBottom,
   tabBarPosition: 'bottom',
   animationEnabled: false,
   swipeEnabled: false
 }
)

const AppContainer = createAppContainer(TabNavigator)

export default class Appss extends React.Component {
  // ...

  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

/*export default (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );*/
  
//export default createAppContainer(AppNavigator)

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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btn: {
    backgroundColor:'pink' 
  },
  chartContainer:{
    width: .9*widths,
    marginTop: 100,
    height: 260
  },
  icon: {
    width: 24,
    height: 24,
  },
  icons: {
    width: 84,
    height: 94,
  }
});
