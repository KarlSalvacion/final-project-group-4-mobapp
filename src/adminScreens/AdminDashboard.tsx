import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import stylesAdminDashboard from '../styles/admin/StyleAdminDashboard';
import { Claim } from '../types';
import { useAuth } from '../context/AuthContext';

type RootStackParamList = {
    Tickets: undefined;
    Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdminDashboard = () => {
    const navigation = useNavigation<NavigationProp>();
    const { isLoading: authLoading } = useAuth();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [serverAvailable, setServerAvailable] = useState(true);

    const ticketStats = serverAvailable ? {
        pending: claims.filter(claim => claim.status === 'pending').length,
        approved: claims.filter(claim => claim.status === 'approved').length,
        rejected: claims.filter(claim => claim.status === 'rejected').length
    } : {
        pending: 0,
        approved: 0,
        rejected: 0
    };

    const recentTickets = serverAvailable ?
        claims.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
        : [];

    const fetchClaims = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('jwtToken');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/claims`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch claims');
            }

            const { success, claims: fetchedClaims } = await response.json();
            if (success) {
                // Sort claims by creation date (newest first)
                const sortedClaims = fetchedClaims.sort((a: Claim, b: Claim) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setClaims(sortedClaims);
            } else {
                throw new Error('Failed to fetch claims');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching claims';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            console.error('Error fetching claims:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch claims when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchClaims();
        }, [fetchClaims])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchClaims();
        setRefreshing(false);
    };

    const handleViewAll = () => {
        navigation.navigate('Tickets');
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    if (authLoading || (loading && !refreshing)) {
        return (
            <View style={[stylesAdminDashboard.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}> 
                <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[stylesAdminDashboard.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity 
                    style={stylesAdminDashboard.retryButton}
                    onPress={fetchClaims}
                >
                    <Text style={stylesAdminDashboard.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={stylesAdminDashboard.mainContainer}>
            <View style={stylesAdminDashboard.headerContainer}>
                <View style={stylesAdminDashboard.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminDashboard.headerLogo}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity
                    style={stylesAdminDashboard.profileButton}
                    onPress={handleProfilePress}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#fff" />
                </TouchableOpacity>
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
                {/* Ticket Statistics */}
                <View style={stylesAdminDashboard.statsContainer}>
                    {/* Large Pending Card */}
                    <View style={stylesAdminDashboard.pendingCard}>
                        <View style={stylesAdminDashboard.iconContainer}>
                            <Ionicons name="time" size={28} color="#fff" />
                        </View>
                        <View style={stylesAdminDashboard.statContent}>
                            <Text style={stylesAdminDashboard.statNumber}>{ticketStats.pending}</Text>
                            <Text style={stylesAdminDashboard.statLabel}>Pending Tickets</Text>
                        </View>
                    </View>

                    {/* Small Cards Container */}
                    <View style={stylesAdminDashboard.smallCardsContainer}>
                        <View style={stylesAdminDashboard.approvedCard}>
                            <View style={stylesAdminDashboard.iconContainer}>
                                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                            </View>
                            <View style={stylesAdminDashboard.statContent}>
                                <Text style={stylesAdminDashboard.statNumber}>{ticketStats.approved}</Text>
                                <Text style={stylesAdminDashboard.statLabel}>Approved</Text>
                            </View>
                        </View>
                        <View style={stylesAdminDashboard.rejectedCard}>
                            <View style={stylesAdminDashboard.iconContainer}>
                                <Ionicons name="close-circle" size={24} color="#fff" />
                            </View>
                            <View style={stylesAdminDashboard.statContent}>
                                <Text style={stylesAdminDashboard.statNumber}>{ticketStats.rejected}</Text>
                                <Text style={stylesAdminDashboard.statLabel}>Rejected</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Recent Tickets */}
                <View style={stylesAdminDashboard.recentTicketsContainer}>
                    <View style={stylesAdminDashboard.recentTicketsHeader}>
                        <Text style={stylesAdminDashboard.recentTicketsTitle}>Recent Tickets</Text>
                        <TouchableOpacity onPress={handleViewAll}>
                            <Text style={stylesAdminDashboard.viewAllButton}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={stylesAdminDashboard.ticketList}>
                        {recentTickets.map((ticket) => (
                            <View key={ticket._id} style={stylesAdminDashboard.ticketItem}>
                                <Text style={stylesAdminDashboard.ticketTitle}>{ticket.description}</Text>
                                <Text style={stylesAdminDashboard.ticketStatus}>
                                    Status: {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </Text>
                                <Text style={stylesAdminDashboard.ticketUser}>
                                    By: {ticket.userId?.name || 'Unknown User'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminDashboard;
