import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, } from 'react-native';
import { stylesGlobal } from './styles/StylesGlobal';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

const AppContent = () => {
  return (
    <SafeAreaView style={stylesGlobal.mainContainer}>
      <StatusBar style="auto" />
        <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppContent />
  );
};


