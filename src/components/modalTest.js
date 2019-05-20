import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  Animated,
  Easing,
  PanResponder, TouchableNativeFeedback

} from "react-native";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");
const { timing, spring } = Animated;

function wrapModal(WrapComponent) {
  return class Wraped extends Component {
    constructor(props) {
      super(props);
      this.state = {
        show: false,
        content: 'this is a content'
      };

      this._animatedValue = new Animated.Value(0);

      this.opacity = this._animatedValue.interpolate({
        inputRange: [0, 7],
        outputRange: [0, 0.6],
        extrapolate: "clamp"
      });

      this.confirm = () => {this.toggleModal()};
      this.cancel = () => {this.toggleModal()};
    }

    componentDidMount() {
      console.log("this is a wrap");
    }

    toggleModal = () => {
      console.log("toggle");

      !this.state.show &&
        this.setState({ show: true }, () => {
          console.log("baaa");
          this.changeAnimated(true);
        });

      this.state.show && this.changeAnimated(false);
    };

    changeAnimated = flag => {
      timing(this._animatedValue, {
        toValue: flag ? 10 : 0,
        duration: 1000,
        easing: Easing.bezier(0.03, 0.84, 0.3, 0.9)
      }).start(() => {
        !flag && this.setState({ show: false });
      });
    };

    setModal = (obj) => {
             const {confirm, content, cancel} = obj;
             confirm && (this.confirm = () => {confirm(); this.toggleModal()});
             cancel && (this.cancel = () => {cancel(); this.toggleModal()});
             content && (this.setState({content}));
             console.log(obj); 
             this.toggleModal();      
    }

    render() {
      const { show, content } = this.state;
      const translateY = this._animatedValue.interpolate({
        inputRange: [0, 10],
        outputRange: [100 - 0.5 * height, 0],
        extrapolate: "clamp"
      });
      const transformStyle = { transform: [{ translateY }] };
      const { people, getPeople } = this.props;
      // const transform = {[

      // ]}
      const Modal = show ? (
        <Animated.View style={[styles.mask, { opacity: this.opacity }]}>
          <Animated.View style={[styles.container, transformStyle]}>
            <Text style={{ color: "yellow", marginBottom: 30 }}>
              this is head {people.people}
            </Text>
            <Text style={{ color: "blue", marginBottom: 30 }}>
                 {content}
            </Text>
            <View style={styles.buttons}>
              <Button title="cancel" color="#f5d300" onPress={this.cancel} />
              <Button
                title="confirm"
                color="#f5d300"
                onPress={this.confirm}
              />
            </View>
          </Animated.View>
        </Animated.View>
      ) : null;
      return (
        <View style={{ flex: 1 }}>
          {Modal}
          <WrapComponent toggleModal={this.toggleModal} setModal={this.setModal}/>
        </View>
      );
    }
  };
}

class Slider extends Component {
  constructor(props){
       super(props);
       this.animatedValue = new Animated.Value(0);
       this._value = 0;

       this.animatedValue.addListener(({value}) => {
                if(value > 0 ){
                //    this._value = value;
                   this.animatedValue.setOffset(0);
                   this.animatedValue.setValue(0);
                   return;
                }
                if(value < -120 ){
                //    this._value = value;
                   console.log('dddd');
                   this.animatedValue.setOffset(0);
                   this.animatedValue.setValue(-120);
                   return;
                }
                this._value = value;
       })

       this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
              if((gestureState.vx > 0 && this._value >=0) || (gestureState.vx < 0 && this._value <=-120)) {
                  return false;             
              }
              return true;   
        },
        onPanResponderGrant: (evt, gestureState) => {
            this.animatedValue.setOffset(this._value);
            this.animatedValue.setValue(0);
            this.props.toggleChoose();
        },
        onPanResponderMove: (evt, gestureState) => {
            if((gestureState.vx > 0 && this._value >=0) || (gestureState.vx < 0 && this._value <=-120)) {
                  return;             
            }
            Animated.event([null, { dx: this.animatedValue}])(evt, gestureState);
        },  
        onPanResponderRelease: (evt, gestureState) => {
            console.log("release");
            console.log(this._value);
            //this._value = 0;
            //this.animatedValue.setValue(0);
            this.animatedValue.flattenOffset();

            if(this._value < -60) {
                   spring(this.animatedValue, {
                       toValue: -120,
                       tension: 41,
                       friction: 7.1
                   }).start(() => {
                   })
            }else{
                   this.backToOrigin();
            }
        }
    });
  }  

  componentWillReceiveProps(nextProps){
      console.log(nextProps);
      if(this.props.detail.choose && !nextProps.detail.choose && this._value == -120)
         this.backToOrigin();               
  }

  backToOrigin = () => {
      spring(this.animatedValue, {
                toValue: 0,
                tension: 41,
                friction: 7.1
         }).start(() => {
      }) 
  }
  
  render(){
      const transformStyle = {
            transform: [{
                 translateX: this.animatedValue
            }]
      }
      const {talkTo, content } = this.props.detail;

      return (
          <View>
            <Animated.View {...this.panResponder.panHandlers} style={{width:width+120,height:70,backgroundColor:'pink',borderBottomWidth:1,flexDirection:'row',...transformStyle}}>
               <View style={{justifyContent: 'space-between', flexDirection:'column', width}}>
                   <View style={{flex:1, justifyContent:'center'}}><Text>{talkTo}</Text></View>
                   <View style={{flex:1, justifyContent:'center'}}><Text style={{color:'green', fontSize:18}}>{content}</Text></View>
               </View>

               <View style={styles.slider}>
                     <TouchableNativeFeedback onPress={() => this.props.setModal(true)}>
                         <View style={{flex:1, height:70, justifyContent:'center', backgroundColor:'orange'}}>
                               <Text>置顶</Text>
                         </View>
                     </TouchableNativeFeedback>
                     <TouchableNativeFeedback onPress={() => this.props.setModal(false)} style={{zIndex:100}}>
                         <View style={{flex:1, height:70, justifyContent:'center', backgroundColor:'chocolate'}}>
                               <Text>删除</Text>
                         </View>         
                     </TouchableNativeFeedback>
               </View>

             </Animated.View>
          </View>
          
      )
  }  
}

class ModalTest extends Component {
  state = {
      info: [
          {talkTo: 'qqqq', content: 'ffffffffff'},
          {talkTo: 'qqqqrrr', content: 'ffffffffff'},
          {talkTo: 'qqqqr嗯嗯嗯', content: 'ffffffffff'}
      ]
  }

  toggleChoose = (index) => {
      return () => {
             const { info } = this.state;
             const _info = info.map((v,i) => {
                  if(i == index)
                     return {...v, choose: !v.choose}
                  else
                     return {...v, choose: false}   
             })
             this.setState({info:_info});
      }
  }

  deleteInfoIndex = (index) => {
       const { info } = this.state;
       this.setState({info: info.filter((v,i) => index != i)})
  }

  setToTopIndex = (index) => {
       const { info } = this.state;
       const filterList = info.filter((v,i) => i!=index);
       this.setState({info: [info[index], ...filterList]});
  }

  setModal = (i, flag) => {
        console.log('嘛嘛嘛')
            const { setModal } = this.props;
            console.log('dddfree');
            setModal({confirm: () => !flag ? this.deleteInfoIndex(i) : this.setToTopIndex(i), content: !flag ? `你确定要删除第${i}条内容吗` : `你确定要置顶第${i}条内容吗`});
  }

  render() {
    const { toggleModal } = this.props;

    const sliders = this.state.info.map((detail,i) => (
        <Slider detail={detail} toggleChoose={this.toggleChoose(i)} setModal={(flag) => {this.setModal(i, flag)}}/>
    ))
    return (
      <View style={{ width, height }}>
        <Button
          onPress={toggleModal}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        {sliders}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    people: state.people
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPeople: () => dispatch({ type: "changePeople", people: "qqqqqq" })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  wrapModal(ModalTest)
);

const styles = StyleSheet.create({
  mask: {
    position: "absolute",
    backgroundColor: "#000",
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 100
  },
  container: {
    position: "absolute",
    width: 300,
    height: 200,
    left: 0.5 * width - 150,
    top: 0.5 * height - 100,
    borderRadius: 30,
    backgroundColor: "pink",
    alignItems: "center",
    paddingTop: 20
  },
  buttons: {
    width: 200,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  slider: {
    //position:'absolute',
    width: 120,
    height:70,
    flexDirection: 'row',
    backgroundColor: 'yellow',
    zIndex:100
  }
});
