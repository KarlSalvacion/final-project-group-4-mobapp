import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import stylesProfileScreen from '../styles/StylesProfileScreen';

type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { userData } = useAuth();
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
                            <Text style={stylesProfileScreen.infoValue}>{userData.name}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="at-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Username</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.username}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="shield-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Role</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.role}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="mail-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Email</Text>
                            <Text style={stylesProfileScreen.infoValue}>{userData.email}</Text>
                        </View>
                    </View>

                    <View style={stylesProfileScreen.infoRow}>
                        <Ionicons name="calendar-outline" size={24} color="#666" />
                        <View style={stylesProfileScreen.infoTextContainer}>
                            <Text style={stylesProfileScreen.infoLabel}>Account Created</Text>
                            <Text style={stylesProfileScreen.infoValue}>
                                {new Date(userData.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};



export default ProfileScreen; 