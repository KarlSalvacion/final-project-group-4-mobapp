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
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('jwtToken');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            // First get current user info
            const userResponse = await fetch(`${BACKEND_BASE_URL}/api/users/check-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch current user');
            }

            const { userData } = await userResponse.json();
            setCurrentUserId(userData._id);

            // Then get all users
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

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'user', username: string) => {
        Alert.alert(
            'Change User Role',
            `Are you sure you want to ${newRole === 'admin' ? 'promote' : 'demote'} ${username} to ${newRole}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    style: 'default',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('jwtToken');
                            if (!token) {
                                throw new Error('No authentication token found');
                            }

                            console.log('Updating role for user:', {
                                userId,
                                newRole,
                                username,
                                token: token.substring(0, 20) + '...'
                            });

                            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/users/${userId}/role`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ role: newRole }),
                            });

                            const data = await response.json();
                            console.log('Response:', {
                                status: response.status,
                                data
                            });

                            if (!response.ok) {
                                throw new Error(data.message || 'Failed to update user role');
                            }

                            // Update the local state
                            setUsers(prevUsers => 
                                prevUsers.map(user => 
                                    user._id === userId ? { ...user, role: newRole } : user
                                )
                            );

                            Alert.alert('Success', `User role updated to ${newRole}`);
                        } catch (err) {
                            console.error('Error updating role:', {
                                error: err,
                                message: err instanceof Error ? err.message : 'Unknown error',
                                userId,
                                newRole
                            });
                            const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
                            Alert.alert('Error', errorMessage);
                        }
                    },
                },
            ],
        );
    };

    const handleDeleteUser = async (userId: string, username: string) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete user ${username}? This action cannot be undone.`,
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
                            const token = await AsyncStorage.getItem('jwtToken');
                            if (!token) {
                                throw new Error('No authentication token found');
                            }

                            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/users/${userId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Accept': 'application/json',
                                },
                            });

                            if (!response.ok) {
                                throw new Error('Failed to delete user');
                            }

                            // Update the local state
                            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                            Alert.alert('Success', 'User deleted successfully');
                        } catch (err) {
                            const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
                            Alert.alert('Error', errorMessage);
                        }
                    },
                },
            ],
        );
    };

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
                    showsVerticalScrollIndicator={false}
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
                            
                            {user._id !== currentUserId && (
                                <View style={stylesAdminUserPage.actionButtons}>
                                    <TouchableOpacity
                                        style={[
                                            stylesAdminUserPage.roleButton,
                                            user.role === 'admin' ? stylesAdminUserPage.demoteButton : stylesAdminUserPage.promoteButton
                                        ]}
                                        onPress={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin', user.username)}
                                    >
                                        <Text style={stylesAdminUserPage.roleButtonText}>
                                            {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={stylesAdminUserPage.deleteButton}
                                        onPress={() => handleDeleteUser(user._id, user.username)}
                                    >
                                        <Text style={stylesAdminUserPage.deleteButtonText}>Delete User</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

export default AdminUserPage; 