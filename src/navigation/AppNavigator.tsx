import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationBar from './NavigationBar';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
            }}>
                <Stack.Screen name="MainTabs" component={NavigationBar} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
