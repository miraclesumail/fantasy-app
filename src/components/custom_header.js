import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Button, Dimensions} from 'react-native';

const widths = Dimensions.get('window').width;

class CustomHeader extends Component{
 
  constructor(props) {
    super(props);
    this.state = { 
        profiles:['qqqq', 'wwww', 'eeeee']
    };
  }

  render() {
    const { navigation } = this.props;
   
    return (
      <View style={styles.header}>
          {
              this.state.profiles.map(item => (
                  <View style={styles.div} key={item}>
                      <Text>{this.props.navigation.state.routes.length > 1 ? this.props.navigation.state.routes[1].params.item : 'dewqwqd'}</Text>
                  </View>            
              ))
          }
      </View>
    );
  }
}

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
      height:50,
      width:widths,
      backgroundColor: '#f5d300',
      flexDirection: 'row'
  },
  div:{
      width:.33*widths,
      height:50,
      borderColor:'orange',
      borderRightWidth:1
  }
});

