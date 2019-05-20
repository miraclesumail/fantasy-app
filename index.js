/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import { Provider } from 'react-redux'
import configureStore from './src/reducers'
import {name as appName} from './app.json';
import SplashScreen from 'react-native-splash-screen';
import { theme } from './src/tool/theme';
import { UtilityThemeProvider } from 'react-native-design-utility';

const store = configureStore()
console.disableYellowBox = true;

export default class ReduxApp extends Component{
    componentDidMount() {
       SplashScreen.hide(); // 隐藏启动屏
    }

    render() {
       return (
            <Provider store={store}>
              <UtilityThemeProvider theme={theme}>
                 <App/>
              </UtilityThemeProvider>   
            </Provider>
       )
    }
}
 
AppRegistry.registerComponent(appName, () => ReduxApp);
