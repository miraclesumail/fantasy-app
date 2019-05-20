import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet, Dimensions, RefreshControl, ActivityIndicator } from 'react-native'

const { width } = Dimensions.get('window');

// renderItem 最好是用purecomponent
function MovieCell({item}) {
    return (
        <View style={styles.movieCell}>
            <View style={{flexDirection: 'row'}}>
                 <View style={styles.pic}></View>
                 <Text>{item.name}</Text>
            </View>  

            <View style={{flexDirection: 'row', alignItems: 'center', width}}>
                 <Text>领衔主演</Text>
                 <Text>{item.bonus}</Text>
                 <Text>{item.date}</Text>
            </View>   
        </View>
    )
}

export class Movies extends Component {

    // static navigationOptions = ({ navigation, navigationOptions }) => {
    //     const { params } = navigation.state;
    //     console.log(navigationOptions);
    //     return {
    //       title: params ? params.otherParam : 'A Nested Details Screen',
    //       /* These values are used instead of the shared configuration! */
    //       headerStyle: {
    //         backgroundColor: navigationOptions.headerTintColor,
    //       },
    //       headerTintColor: navigationOptions.headerStyle.backgroundColor,
    //     };
    //   }

  state = {
      movies: [
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间www', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间www111', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
          {name: '盗梦空间www222', actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000},
      ],
      refreshing: false,
      loading: false,
      onEndReachedCalledDuringMomentum: true
  }

  _keyExtractor = (item, index) => index + 'qq'

  refreshView = () => {
      this.setState({refreshing: true});
      console.log('refreshing now');
      setTimeout(() => {
         this.setState({refreshing: false});
      }, 2000)
  }

  // 防止2次触发
  onEndReached = (info) => {
       if(!this.state.onEndReachedCalledDuringMomentum) return;
       console.log(info);
       this.setState({loading:true, onEndReachedCalledDuringMomentum: false});
       const movies = this.state.movies.slice();
       setTimeout(() => {
            movies.push( {name: `盗梦空间${movies.length}qqq`, actor: ['qqqq','www','eee'], date:'2011-11-12', bonus:150000})
            this.setState({movies, loading: false})
       }, 1500);
  }

  onScrollEndDrag = (e) => {
      console.log(e)
  }

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

  render() {
    const {refreshing, movies} = this.state;
    return (
      <View>
         <View></View>
         <FlatList
             data={movies}
             renderItem={({item}) => <MovieCell item={item} />}
             keyExtractor={this._keyExtractor} 
             onMomentumScrollEnd = {() => {this.setState({onEndReachedCalledDuringMomentum: true});}}
             refreshControl = {<RefreshControl colors={['yellow', 'green']}  onRefresh = {this.refreshView} refreshing = {refreshing}/>}
             onEndReachedThreshold = {0.1}
             onEndReached = {this.onEndReached}
             ListFooterComponent = {this.renderFooter}
         />
      </View>
    )
  }
}

export default Movies

const styles = StyleSheet.create({
      pic: {
          width: 30,
          height: 30,
          backgroundColor: 'yellowgreen'
      },
      movieCell: {
          height: 100,
          width
      }
})