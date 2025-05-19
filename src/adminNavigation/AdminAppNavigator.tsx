import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminNavigationBar from './AdminNavigationBar';

const Stack = createStackNavigator();

export default function AdminAppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="AdminNavigationBar" component={AdminNavigationBar} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


