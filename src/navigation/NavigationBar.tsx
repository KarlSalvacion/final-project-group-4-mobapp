import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import MyClaimsScreen from '../screens/MyClaimsScreen';
import { stylesNavigationBar } from '../styles/navigation/StylesNavigationBar';

const Tab = createBottomTabNavigator();

const NavigationBar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabel: () => {
                    return null;
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'MyClaims') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'rgb(255, 255, 255)',
                tabBarInactiveTintColor: 'rgb(239, 239, 239)',
                headerShown: false,
                tabBarStyle: stylesNavigationBar.tabBarContainer,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="MyClaims" component={MyClaimsScreen} />
            <Tab.Screen name="MyListings" component={MyListingsScreen} />
        </Tab.Navigator>
    );  
}

export default NavigationBar;
