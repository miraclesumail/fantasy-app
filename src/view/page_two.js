import React, { Component } from 'react'
import { Text, View, Animated } from 'react-native'
import ScrollRefresh from '../components/scroll_refresh'

class PageTwo extends Component {
  render() {
    return (
      <View style={{position:'relative'}}>
          <ScrollRefresh>
              <View>
                  <Text>jjjjjjj</Text>
              </View>
          </ScrollRefresh>
      </View>
    )
  }
}

export default PageTwo