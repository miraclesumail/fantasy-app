import React, { Component } from 'react'
import { Text, View, FlatList, Dimensions, Image } from 'react-native'

const { width } = Dimensions.get('window');

function Post({item}) {
     const arrs = item.content.split('\n');
     return (
         <View style={{width:.9*width, flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#f0f0f0', paddingBottom:10}}>
             <View><Image source={require('../imgs/qq2.jpg')} style={{width:.1*width, height:.1*width}}/></View>
             <View style={{width:.8*width, paddingLeft:.06*width}}>
                 <View><Text style={{fontSize:20, fontWeight:'bold', color: '#4F88F2'}}>{item.name}</Text></View>
                 {
                     arrs.map(item => (
                         <View><Text style={{fontSize:16, color:'black', lineHeight:18}}>{item}</Text></View>
                     ))
                 }
                 
                 <View><Text style={{color:'grey', fontSize:14,lineHeight:30}}>{item.time}</Text></View>
             </View>
         </View>
     )
}

class Friends extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        console.log(navigationOptions);
        return {
          title: params ? params.otherParam : '朋友圈',
          /* These values are used instead of the shared configuration! */
          headerStyle: {
            backgroundColor: navigationOptions.headerTintColor,
            height: 50,
            marginBottom:10
          },
          headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
      }

    state = {
        infos: [
            {name:'being Ray', content:'打开快点快点快点快点回事\n解决实际上就是\n看看参考参考参考开车开车开车', time:'一小时前'}
        ]
    }  

  _keyExtractor = (item, index) => index + 'qq';
  
  render() {
    return (
      <View style={{alignItems: 'center'}}>
          <FlatList
              data={this.state.infos}
              extraData={this.state}
              renderItem={({item}) => <Post item={item}/>}
              keyExtractor={this._keyExtractor}
          />
      </View>
    )
  }
}

export default Friends
