/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions, Image, Modal,TouchableHighlight, TouchableOpacity,TouchableWithoutFeedback, ListView} from 'react-native';
import { connect } from 'react-redux'
import Orientation from 'react-native-orientation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const widths = Dimensions.get('window').height;
export default class MovieDetail extends Component{
  constructor(props){
      super(props);
      const ds = new ListView.DataSource({
                  rowHasChanged: (r1, r2) => r1 !== r2,
                  sectionHeaderHasChanged: (r1, r2) => r1 !== r2
              });
      this.state = {
          imgs: [
              require('../imgs/qq1.jpg'),
              require('../imgs/qq2.jpg'),
              require('../imgs/qq3.jpg'),
          ],
          dataSource: ds.cloneWithRowsAndSections({
                  '北美票房':[
                      {name: '流浪地球', amount:'34560', paipian:'25%', shangzuo: '50%'},
                      {name: '流浪地球', amount:'34560', paipian:'25%', shangzuo: '50%'},
                  ],
                  '中国票房':[
                      {name: '猩球崛起', amount:'34560', paipian:'25%', shangzuo: '50%'},
                      {name: '猩球崛起', amount:'34560', paipian:'25%', shangzuo: '50%'},
                  ]
          }),
          modalVisible: false,
          activeIndex: 0
      }
  }  

//   componentDidMount() {
//     Orientation.lockToLandscape();
//   }

//   componentWillUnmount() {
//     Orientation.lockToPortrait();
//   }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setActiveIndex(index) {
    this.setState({activeIndex: index});
  }

  renderSectionHeader(sectionData, category) {
    return (
        <Text style={{fontWeight: "700"}}>{category}</Text>
    )
  }  

  render() {
    return (
      <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
              {
              Array.from({length:3}).map((item,index) => (
                  <View style={styles.grid} key={index}>
                      <TouchableHighlight onPress={() => {this.setModalVisible(true)}}>
                            <Image source={this.state.imgs[index]} style={styles.image} />
                      </TouchableHighlight>
                  </View>
              ))
              }
          </View>
          
          
          <View style={styles.navbar}>
               <TouchableWithoutFeedback onPress={() => {this.setActiveIndex(0)}}>
                   <View style={this.state.activeIndex == 0 ? [styles.active, styles.menu]: styles.menu}>
                       <Text style={styles.text}>qqqqqq</Text>
                    </View>
               </TouchableWithoutFeedback>

               <TouchableWithoutFeedback onPress={() => {this.setActiveIndex(1)}}>
                   <View style={this.state.activeIndex == 1 ? [styles.active, styles.menu]: styles.menu}>
                       <Text style={styles.text}>wwwwww</Text>
                   </View>
               </TouchableWithoutFeedback>

               <TouchableWithoutFeedback onPress={() => {this.setActiveIndex(2)}}>
                   <View style={this.state.activeIndex ==  2? [styles.active, styles.menu]: styles.menu}>
                       <Text style={styles.text}>eeeeeee</Text>
                    </View>
               </TouchableWithoutFeedback>
          </View>

          <ListView
             dataSource={this.state.dataSource}
             renderRow={(rowData, sectionID, rowID, highlightRow) => (
                    <TouchableHighlight onPress={() => {highlightRow(sectionID, rowID)}}>
                        <View style={rowID %2 == 0 ? styles.item:styles.deep}> 
                            <Text style={styles.inner}>{rowData.name}</Text><Text style={styles.inner}>{rowData.amount}</Text>
                            <Text style={styles.inner}>{rowData.paipian} {sectionID}</Text><Text style={styles.inner}>{rowData.shangzuo} {rowID}</Text>
                        </View>
                    </TouchableHighlight>
                 )}
              
             renderSectionHeader={this.renderSectionHeader.bind(this)}
 
             renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
                return (
                    <View
                        key={`${sectionID}-${rowID}`}
                        style={{height: 2, backgroundColor: adjacentRowHighlighted ? 'blue' : 'red'}} 
                    />);
                }}    
             />

          <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
            }}>
            <View style={styles.shade}>
                <View style={styles.modal}>
                    <Text>Hello World!</Text>
                    <TouchableHighlight
                        onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                        }}>
                        <Text>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
            </View>
          </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1
  },
  grid: {
    width: widths/3,
    height: 100,
    paddingLeft:15,
    paddingRight:15,
    //backgroundColor:'pink'
  },
  image: {
      width:'100%',
      height: '100%'
  },
  shade: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  modal:{
      backgroundColor: '#f5d300',
      width: .6*widths,
      height: 200,
      marginTop: 100,
      borderRadius: 10
  },
  navbar: {
      width: widths,
      backgroundColor: 'pink',
      height:80,
      flexDirection: 'row'
  },
  item: {
      width: widths,
      height: 30,
      flexDirection: 'row'
  },
  deep: {
      width: widths,
      height: 30,
      flexDirection: 'row',
      backgroundColor: '#f5d300'
  },
  inner: {
      width: '25%',
      height: 30,
      textAlign: 'center',
      lineHeight: 30
  },
  menu:{
      width:.33*widths,
      color: 'chocolate',
      height: 80,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
  },
  active: {
      backgroundColor: 'orange',
      color:'green'
  }
});
