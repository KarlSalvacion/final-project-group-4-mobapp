import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../screens/account-control/LoginPage';
import SignUpScreen from '../screens/account-control/SignUpScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* Add other auth-related screens here */}
    </Stack.Navigator>
  );
};

export default AuthNavigator; 