import React, { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesAdminUserPage from '../styles/admin/StyleUserPage';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

const AdminUserPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - replace with actual API call
    const users: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
    ];

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                <ScrollView>
                    {filteredUsers.map(user => (
                        <View key={user.id} style={stylesAdminUserPage.userCard}>
                            <Text style={stylesAdminUserPage.userName}>{user.name}</Text>
                            <Text style={stylesAdminUserPage.userEmail}>{user.email}</Text>
                            <Text style={stylesAdminUserPage.userRole}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

export default AdminUserPage; 