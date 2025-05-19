import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import stylesAdminDashboard from '../src/styles/admin/StyleAdminDashboard';

const AdminDashboard = () => {
    return (
        <View style={stylesAdminDashboard.mainContainer}>
            <View style={stylesAdminDashboard.headerContainer}>
                <Text style={stylesAdminDashboard.headerTitle}>DLSL FoundIt</Text>
                <TouchableOpacity style={stylesAdminDashboard.profileButton}>
                    <Ionicons name="person" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AdminDashboard;
