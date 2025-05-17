import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../screens/LoginPage';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      {/* Add other auth-related screens here */}
    </Stack.Navigator>
  );
};

export default AuthNavigator; 