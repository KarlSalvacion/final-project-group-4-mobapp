import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TextInput, ScrollView, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import stylesAdminUserPage from '../styles/admin/StyleUserPage';

interface User {
    _id: string;
    username: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
}

const AdminUserPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('jwtToken');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const { success, users: fetchedUsers } = await response.json();
            if (success) {
                setUsers(fetchedUsers);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching users';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !refreshing) {
        return (
            <View style={[stylesAdminUserPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[stylesAdminUserPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity 
                    style={stylesAdminUserPage.retryButton}
                    onPress={fetchUsers}
                >
                    <Text style={stylesAdminUserPage.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={stylesAdminUserPage.mainContainer}>
            <View style={stylesAdminUserPage.headerContainer}>
                <View style={stylesAdminUserPage.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminUserPage.headerLogo}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View style={stylesAdminUserPage.userListContainer}>
                <View style={stylesAdminUserPage.searchContainer}>
                    <Ionicons 
                        name="search" 
                        size={20} 
                        color="#666" 
                        style={stylesAdminUserPage.searchIcon}
                    />
                    <TextInput
                        style={stylesAdminUserPage.searchInput}
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['rgb(25, 153, 100)']}
                            tintColor="rgb(25, 153, 100)"
                        />
                    }
                >
                    {filteredUsers.map(user => (
                        <View key={user._id} style={stylesAdminUserPage.userCard}>
                            <Text style={stylesAdminUserPage.userName}>{user.name}</Text>
                            <Text style={stylesAdminUserPage.userEmail}>{user.email}</Text>
                            <Text style={stylesAdminUserPage.userUsername}>@{user.username}</Text>
                            <Text style={[
                                stylesAdminUserPage.userRole,
                                user.role === 'admin' ? stylesAdminUserPage.adminRole : stylesAdminUserPage.userRoleText
                            ]}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Text>
                            <Text style={stylesAdminUserPage.userDate}>
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

export default AdminUserPage; 