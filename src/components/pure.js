import React, { Component, PureComponent } from 'react'
import { Text, View } from 'react-native'

class Pure extends PureComponent {
//   shouldComponentUpdate(nextProps, nextState) {
//       console.log(nextProps);
//       return true;
//   }  

  constructor(props){
      super(props);
      this.state = {
          a: 'rrrr'
      }
  }

  componentWillUpdate(nextProps, nextState){
      console.log(nextProps);
      console.log('will update');
  }

  render() {
    return (
      <View>
          <Text>{this.state.a}</Text>
      </View>
    )
  }
}

export default Pure