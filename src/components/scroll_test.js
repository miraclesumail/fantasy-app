/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image, ScrollView, Dimensions, Button, Picker} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';

const widths = Dimensions.get('window').width;

export default class ScrollTest extends Component{
  constructor(props) {
      super(props);
      this.state = {
          avatarSource: null,
          list:[
              'Welcome to React Native111', 'Welcome to React Native222', 'Welcome to React Native333',
              'Welcome to React Native444', 'Welcome to React Native555', 'Welcome to React Native666'
          ],
          options: ['java', 'javascript', 'python', '.net', 'php', 'qqqq', 'wwww', 'eeeee'],
          language: '',
          date: '2016-05-05 20:00',
          datetime1: '2016-05-05 20:00'
      };
  }

  scrollTo(){
     // this.scroller.scrollTo({y:100});
      this.scroller.scrollToEnd();
  }

  changeLog(contentWidth, contentHeight) {
      console.log('change');
      console.log(contentHeight);
  }

  addList() {
      this.setState(state => (
          {list: [...state.list, `Welcome to React Native new${state.list.length + 1}`]}
      ))
  }

  render() {
    //const { people, isFetching } = this.props.people;
    return (
      <View style={{flex:1}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', height:50, width:widths}}>
              <Button title="滚动100" onPress={this.scrollTo.bind(this)}></Button>
              <Button title="加1" onPress={this.addList.bind(this)}></Button>
          </View>

          <View style={{width:300,height:200}}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer} ref={(scroller) => {this.scroller = scroller}}
                onScroll={(e)=>{
                    //e.nativeEvent.contentOffset.y
                }} stickyHeaderIndices={[0]} onContentSizeChange={this.changeLog}>
                {
                    this.state.list.map((item,index) => (
                          <View style={styles.welcome} key={index}>
                                <Text>{item}</Text>
                          </View>
                    ))
                }              
            </ScrollView>
         </View> 

         {/*<Picker
            selectedValue={this.state.language}
            style={{height: 70, width: 190}}
            onValueChange={(itemValue, itemIndex) => {
                console.log(itemIndex);
                this.setState({language: itemValue})
            }}>
            {
                this.state.options.map((item,index) => (
                    <Picker.Item label={item} value={item} key={index}/>
                ))
            }
         </Picker>  */}
          <Icon
                    name='sort-down'
                    size={20}
                    color='red'
                    style={[{right: 18, top: 4, position: 'absolute'}]}
                />
           <View style={{flexDirection:'row'}}>
               <DatePicker
                    style={{width: 200, marginTop:30}}
                    date={this.state.date}
                    mode="date"
                    placeholder="输入开始时间"
                    format="YYYY-MM-DD"
                    minDate="2016-05-01"
                    maxDate="2016-06-01"
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    iconSource={require('../assets/img/google_calendar.png')}
                    customStyles={{ dateInput: {
                        marginLeft: 6,
                        borderColor: '#f5d300'
                    }}}
                    onDateChange={(date) => {this.setState({date: date});}}
               />

               <DatePicker
                    style={{width: 200, marginTop:30}}
                    date={this.state.datetime1}
                    mode="datetime"
                    placeholder="输入结束时间"
                    format="YYYY-MM-DD HH:mm"
                    minDate="2016-05-01"
                    maxDate="2016-06-01"
                    confirmBtnText="确定"
                    cancelBtnText="取消"
                    customStyles={{ dateInput: {
                        marginLeft: 6,
                        borderColor: '#f5d300'
                        },disabled:true}
                    }
                    onDateChange={(date) => {this.setState({datetime1: date});}}
               />
           </View>
           <Text>date: {this.state.datetime1}</Text>
      </View>  
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
     width:300,
     borderWidth: 1,
     borderColor: '#f5d300',
     
  },
  contentContainer: {
    paddingTop: 30
  },
  welcome: {
    margin: 20,
    backgroundColor: 'orange',
    textAlign: 'center',
    fontSize: 20,
  }
});
