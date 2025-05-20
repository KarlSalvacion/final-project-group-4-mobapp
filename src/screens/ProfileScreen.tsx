import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import stylesProfileScreen from '../styles/StylesProfileScreen';
import { BACKEND_BASE_URL } from '../config/apiConfig';

type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
    Login: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { userData, logout, token } = useAuth();

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Not available';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        await logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BACKEND_BASE_URL}/api/users/delete-account`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    email: userData?.email,
                                }),
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Failed to delete account');
                            }

                            await logout();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.error('Delete account error:', error);
                            Alert.alert(
                                'Error',
                                'Unable to delete account. Please try again later or contact support.'
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    if (!userData) {
        return (
            <View style={stylesProfileScreen.errorContainer}>
                <View style={stylesProfileScreen.errorHeader}>
                    <TouchableOpacity
                        style={stylesProfileScreen.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <Ionicons name="alert-circle-outline" size={50} color="#f00" />
                <Text style={stylesProfileScreen.errorText}>No user data available</Text>
            </View>
        );
    }

    return (
        <ScrollView style={stylesProfileScreen.container}>
            <View style={stylesProfileScreen.header}>
                <TouchableOpacity 
                    style={stylesProfileScreen.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={stylesProfileScreen.headerTitle}>Profile</Text>
            </View>

            <View style={stylesProfileScreen.profileSection}>
                <View style={stylesProfileScreen.photoContainer}>
                    <Ionicons name="person-circle" size={120} color="#666" />
                </View>

                <View style={stylesProfileScreen.infoContainer}>
                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="person-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Name</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.name || 'Not set'}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="at-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Username</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.username || 'Not set'}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="shield-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Role</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.role || 'user'}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="mail-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Email</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.email || 'Not set'}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="calendar-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Account Created</Text>
                            <Text style={stylesProfileScreen.infoValue}>
                                {formatDate(userData.createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={stylesProfileScreen.buttonContainer}>
                    <TouchableOpacity
                        style={[stylesProfileScreen.button, stylesProfileScreen.logoutButton]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                        <Text style={stylesProfileScreen.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[stylesProfileScreen.button, stylesProfileScreen.deleteButton]}
                        onPress={handleDeleteAccount}
                    >
                        <Ionicons name="trash-outline" size={24} color="#fff" />
                        <Text style={stylesProfileScreen.buttonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen; 