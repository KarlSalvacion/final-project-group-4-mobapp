import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import stylesAdminDashboard from '../styles/admin/StyleAdminDashboard';

type RootStackParamList = {
    Tickets: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Claim {
    _id: string;
    listingId: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    proofImages: string[];
    createdAt: string;
    updatedAt: string;
}

const AdminDashboard = () => {
    const navigation = useNavigation<NavigationProp>();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const ticketStats = {
        pending: claims.filter(claim => claim.status === 'pending').length,
        approved: claims.filter(claim => claim.status === 'approved').length,
        rejected: claims.filter(claim => claim.status === 'rejected').length
    };

    const recentTickets = claims
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/claims');
            if (!response.ok) {
                throw new Error('Failed to fetch claims');
            }
            const data = await response.json();
            setClaims(data);
        } catch (err) {
            // Use mock data when server is not available
            const mockClaims: Claim[] = [
                {
                    _id: '1',
                    listingId: '101',
                    userId: 'user1',
                    status: 'pending',
                    description: 'Lost ID Card',
                    proofImages: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    listingId: '102',
                    userId: 'user2',
                    status: 'approved',
                    description: 'Found Laptop',
                    proofImages: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '3',
                    listingId: '103',
                    userId: 'user3',
                    status: 'rejected',
                    description: 'Missing Backpack',
                    proofImages: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            setClaims(mockClaims);
            console.log('Using mock data - Server not available');
        } finally {
            setLoading(false);
        }
    };

    const handleViewAll = () => {
        navigation.navigate('Tickets');
    };

    if (loading) {
        return (
            <View style={[stylesAdminDashboard.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[stylesAdminDashboard.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red' }}>{error}</Text>
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
            </View>

            <ScrollView>
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
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AdminDashboard;
