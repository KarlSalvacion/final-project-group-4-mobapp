import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationBar from './NavigationBar';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../context/AuthContext';
import AdminNavigationBar from '../adminNavigation/AdminNavigationBar';
import DetailedItemListingScreen from '../screens/DetailedItemListingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoadingScreen from '../components/LoadingScreen';
import MyClaimsScreen from '../screens/MyClaimsScreen';
import AddListingScreen from '../screens/AddListingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
            }}>
                {!isAuthenticated ? (
                    // Auth Stack
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : user?.role === 'admin' ? (
                    // Admin Stack
                    <>
                        <Stack.Screen name="AdminTabs" component={AdminNavigationBar} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                    </>
                ) : (
                    // User Stack
                    <>
                        <Stack.Screen name="MainTabs" component={NavigationBar} />
                        <Stack.Screen name="DetailedItemListing" component={DetailedItemListingScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="MyClaims" component={MyClaimsScreen} />
                        <Stack.Screen name="AddListing" component={AddListingScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
