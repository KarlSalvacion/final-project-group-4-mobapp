import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationBar from './NavigationBar';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../context/AuthContext';
import AdminNavigationBar from '../adminNavigation/AdminNavigationBar';
import DetailedItemListingScreen from '../screens/DetailedItemListingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, userType } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
            }}>
                {!isAuthenticated ? (
                    // Auth Stack
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : userType === 'admin' ? (
                    // Admin Stack
                    <Stack.Screen name="AdminTabs" component={AdminNavigationBar} />
                ) : (
                    // User Stack
                    <>
                        <Stack.Screen name="MainTabs" component={NavigationBar} />
                        <Stack.Screen name="DetailedItemListing" component={DetailedItemListingScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
