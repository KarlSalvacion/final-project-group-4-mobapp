import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { stylesGlobal } from './styles/StylesGlobal';
import AppNavigator from './navigation/AppNavigator';
import { ListingProvider } from './context/ListingContext';

export default function App() {
  return (
    <ListingProvider>
      <SafeAreaView style={stylesGlobal.mainContainer}>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaView>
    </ListingProvider>
  );
}


