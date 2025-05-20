import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboard from '../adminScreens/AdminDashboard';
import AdminListingPage from '../adminScreens/AdminListingPage';
import AdminTicketPage from '../adminScreens/AdminTicketPage';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: 'rgb(25, 153, 100)',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 10,
  },
});

export default function AdminNavigationBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabel: () => {
                    return null;
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Tickets') {
                        iconName = focused ? 'ticket' : 'ticket-outline';
                    } else if (route.name === 'Listings') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else {
                        iconName = 'alert-circle';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'rgb(255, 255, 255)',
                tabBarInactiveTintColor: 'rgb(239, 239, 239)',
                headerShown: false,
                tabBarStyle: styles.tabBarContainer,
            })}
        >
            <Tab.Screen name="Dashboard" component={AdminDashboard} />
            <Tab.Screen name="Tickets" component={AdminTicketPage} />
            <Tab.Screen name="Listings" component={AdminListingPage} />
        </Tab.Navigator>
    );
}
