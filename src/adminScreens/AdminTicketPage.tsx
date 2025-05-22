import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesAdminTicketPage from '../styles/admin/StyleTicketPage';

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

const AdminTicketPage = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

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
        } catch (error) {
            // Use mock data when server is not available
            const mockClaims: Claim[] = [];
            setClaims(mockClaims);
        } finally {
            setLoading(false);
        }
    };

    const filteredClaims = claims.filter(claim => claim.status === activeFilter);

    return (
        <View style={stylesAdminTicketPage.mainContainer}>
            {/* Slimmer Header Bar */}
            <View style={stylesAdminTicketPage.headerContainer}>
                <View style={stylesAdminTicketPage.headerContent}>
                    <Image
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminTicketPage.headerLogo}
                        resizeMode="contain"
                    />
                </View>
            </View>
            {/* Centered Title */}
            <Text style={stylesAdminTicketPage.headerTitle}>Tickets</Text>
            <View style={stylesAdminTicketPage.filterRow}>
                <TouchableOpacity
                    style={[
                        stylesAdminTicketPage.filterButton,
                        stylesAdminTicketPage.pendingButton,
                        activeFilter === 'pending' ? { opacity: 1 } : { opacity: 0.5 }
                    ]}
                    onPress={() => setActiveFilter('pending')}
                >
                    <Text style={stylesAdminTicketPage.filterButtonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        stylesAdminTicketPage.filterButton,
                        stylesAdminTicketPage.approvedButton,
                        activeFilter === 'approved' ? { opacity: 1 } : { opacity: 0.5 }
                    ]}
                    onPress={() => setActiveFilter('approved')}
                >
                    <Text style={stylesAdminTicketPage.filterButtonText}>Approved</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        stylesAdminTicketPage.filterButton,
                        stylesAdminTicketPage.rejectedButton,
                        activeFilter === 'rejected' ? { opacity: 1 } : { opacity: 0.5 }
                    ]}
                    onPress={() => setActiveFilter('rejected')}
                >
                    <Text style={stylesAdminTicketPage.filterButtonText}>Rejected</Text>
                </TouchableOpacity>
            </View>
            <View style={stylesAdminTicketPage.filterBar}>
                <Ionicons name="filter" size={20} color="#888" style={stylesAdminTicketPage.filterIcon} />
                <Text style={stylesAdminTicketPage.filterLabel}>FILTER</Text>
            </View>
            <View style={{ flex: 1 }}>
                {filteredClaims.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#888', fontSize: 18, fontWeight: '500' }}>No tickets available</Text>
                    </View>
                ) : (
                    <ScrollView style={stylesAdminTicketPage.ticketList}>
                        {filteredClaims.map((claim) => (
                            <View key={claim._id} style={stylesAdminTicketPage.ticketItem} />
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default AdminTicketPage;
