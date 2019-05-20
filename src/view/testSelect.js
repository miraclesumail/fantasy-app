import React from 'react';
import { Button, Text, TextInput, Platform, ScrollView, StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
// import RNPickerSelect from './debug';

const sports = [
    {
        label: 'Football',
        value: 'football',
    },
    {
        label: 'Baseball',
        value: 'baseball',
    },
    {
        label: 'Hockey',
        value: 'hockey',
    },
];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.inputRefs = {
            firstTextInput: null,
            favSport0: null,
            favSport1: null,
            lastTextInput: null,
        };

        this.state = {
            numbers: [
                {
                    label: '1',
                    value: 1,
                    color: 'red',
                    backgroundColor:'red'
                },
                {
                    label: '2',
                    value: 2,
                    color: 'green',
                },
            ],
            favSport0: undefined,
            favSport1: undefined,
            favSport2: undefined,
            favSport3: undefined,
            favSport4: 'baseball',
            favNumber: undefined,
        };
    }

    render() {
        const placeholder = {
            label: 'Select a sport...',
            value: null,
            color: '#9EA0A4',
        };

        return (
            <ScrollView style={styles.container}>
                <Text>Standard TextInput</Text>
                <TextInput
                    ref={(el) => {
                        this.inputRefs.firstTextInput = el;
                    }}
                    returnKeyType="next"
                    enablesReturnKeyAutomatically
                    onSubmitEditing={() => {
                        this.inputRefs.favSport0.togglePicker();
                    }}
                    style={
                        Platform.OS === 'ios'
                            ? pickerSelectStyles.inputIOS
                            : pickerSelectStyles.inputAndroid
                    }
                    blurOnSubmit={false}
                />

                <View paddingVertical={5} />

                <Text>useNativeAndroidPickerStyle (default)</Text>
                {/* and iOS onUpArrow/onDownArrow toggle example */}
               

                <View paddingVertical={5} />

                <Text>set useNativeAndroidPickerStyle to false</Text>
                <RNPickerSelect
                    placeholder={placeholder}
                    items={sports}
                    onValueChange={(value) => {
                        this.setState({
                            favSport1: value,
                        });
                    }}
                    style={pickerSelectStyles}
                    value={this.state.favSport1}
                    useNativeAndroidPickerStyle={false}
                    ref={(el) => {
                        this.inputRefs.favSport1 = el;
                    }}
                />

                <View paddingVertical={5} />

                <Text>set placeholder to empty object</Text>
                <RNPickerSelect
                    placeholder={{}}
                    items={sports}
                    onValueChange={(value) => {
                        this.setState({
                            favSport2: value,
                        });
                    }}
                    style={pickerSelectStyles}
                    value={this.state.favSport2}
                />

                <View paddingVertical={5} />

                {/* and useNativeAndroidPickerStyle={false} with underlineColorAndroid */}
               

                <View paddingVertical={5} />

                <Text>custom icon using react-native-vector-icons</Text>
               

                <View paddingVertical={5} />

                <Text>custom icon using your own css</Text>
                {/* and placeholderTextColor, showing colors on items, useNativeAndroidPickerStyle={false} */}
                <RNPickerSelect
                    placeholder={{
                        label: 'Select a number or add another...',
                        value: null,
                        color: 'red',
                    }}
                    items={this.state.numbers}
                    onValueChange={(value) => {
                        this.setState({
                            favNumber: value,
                        });
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 20,
                            right: 10,
                        },
                    }}
                    value={this.state.favNumber}
                    placeholderTextColor="purple"
                    Icon={() => {
                        return (
                            <View
                                style={{
                                    backgroundColor: 'transparent',
                                    borderTopWidth: 10,
                                    borderTopColor: 'gray',
                                    borderRightWidth: 10,
                                    borderRightColor: 'transparent',
                                    borderLeftWidth: 10,
                                    borderLeftColor: 'transparent',
                                    width: 0,
                                    height: 0,
                                }}
                            />
                        );
                    }}
                />
               
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 10,
        flex: 1,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'yellow',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
