import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent('pay_as_you_drive', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('pay_as_you_drive', { rootTag });
}
