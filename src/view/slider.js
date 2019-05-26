/*import * as React from "react";
import { StyleSheet, Platform , Dimensions, View} from "react-native";
import { Interactable, ReText } from "react-native-redash";
import { DangerZone } from "expo";

const { Animated } = DangerZone;
const {
  Value, max, add, round, divide,
} = Animated;


const { width: totalWidth } = Dimensions.get("window");
const count = 5;
const width = totalWidth / count;
const height = width;

export default class Slider extends React.Component {
  render() {
        const x = new Value(0);
        return (
            <View style={styles.container}>
            <Animated.View
                style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "#f5d300",
                width: add(x, height),
                height,
                borderRadius: height / 2,
                }}
            />
            <Cursor size={height} {...{ x, count }} />
            </View>
        );
  }    
};

const styles = StyleSheet.create({
  container: {
    width: totalWidth,
    height,
    borderRadius: height / 2,
    backgroundColor: "#f1f2f6",
  },
});



class Cursor extends React.PureComponent{
  render() {
    const { size, count, x: animatedValueX } = this.props;
    const snapPoints = new Array(count).fill(0).map((e, i) => ({ x: i * size, tension:3000 }));
    //const index = round(divide(animatedValueX, size));
    return (
      <Interactable style={StyleSheet.absoluteFill} {...{ snapPoints, animatedValueX }} horizontalOnly>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "white",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
         
        </Animated.View>
      </Interactable>
    );
  }
}*/
