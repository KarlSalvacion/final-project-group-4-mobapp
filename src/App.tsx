import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { stylesGlobal } from './styles/StylesGlobal';
import AppNavigator from './navigation/AppNavigator';
import { ListingProvider } from './context/ListingContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ListingProvider>
        <SafeAreaView style={stylesGlobal.mainContainer}>
          <StatusBar style="auto" />
          <AppNavigator />
        </SafeAreaView>
      </ListingProvider>
    </AuthProvider>
  );
}


