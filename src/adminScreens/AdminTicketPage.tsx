import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    FlatList, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    Image,
    Alert,
    TextInput,
    Modal,
    ScrollView,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import stylesAdminTicketPage from '../styles/admin/StyleTicketPage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Claim {
    _id: string;
    listingId: {
        title: string;
        type: 'found' | 'lost';
    };
    userId: {
        name: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    proofImages: string[];
    createdAt: string;
    updatedAt: string;
}

type RootStackParamList = {
    Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdminTicketPage = () => {
    const navigation = useNavigation<NavigationProp>();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [refreshing, setRefreshing] = useState(false);

    const filteredClaims = claims.filter(claim => claim.status === activeFilter);

    const fetchClaims = async () => {
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
                setClaims(fetchedClaims);
            } else {
                throw new Error('Failed to fetch claims');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching claims';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateClaimStatus = async (claimId: string, status: 'pending' | 'approved' | 'rejected') => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/claims/${claimId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, notes }),
            });

            if (!response.ok) {
                throw new Error('Failed to update claim');
            }

            const { success } = await response.json();
            if (success) {
                Alert.alert('Success', 'Claim status updated successfully');
                setModalVisible(false);
                setSelectedClaim(null);
                setNotes('');
                fetchClaims();
            } else {
                throw new Error('Failed to update claim');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating claim';
            Alert.alert('Error', errorMessage);
        }
    };

    const handleClaimPress = (claim: Claim) => {
        setSelectedClaim(claim);
        setModalVisible(true);
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchClaims();
        setRefreshing(false);
    }, [fetchClaims]);

    useEffect(() => {
        fetchClaims();
    }, []);

    if (loading) {
        return (
            <View style={[stylesAdminTicketPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[stylesAdminTicketPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity 
                    style={stylesAdminTicketPage.retryButton}
                    onPress={fetchClaims}
                >
                    <Text style={stylesAdminTicketPage.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={stylesAdminTicketPage.mainContainer}>
            <View style={stylesAdminTicketPage.headerContainer}>
                <View style={stylesAdminTicketPage.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminTicketPage.headerLogo}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity
                    style={stylesAdminTicketPage.profileButton}
                    onPress={handleProfilePress}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Centered Title */}
            <Text style={stylesAdminTicketPage.headerTitle}>Tickets</Text>
            
            {/* Filter Buttons */}
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
                        stylesAdminTicketPage.approveButton,
                        activeFilter === 'approved' ? { opacity: 1 } : { opacity: 0.5 }
                    ]}
                    onPress={() => setActiveFilter('approved')}
                >
                    <Text style={stylesAdminTicketPage.filterButtonText}>Approved</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        stylesAdminTicketPage.filterButton,
                        stylesAdminTicketPage.rejectButton,
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

            {filteredClaims.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#888', fontSize: 18, fontWeight: '500' }}>No tickets available</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredClaims}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['rgb(25, 153, 100)']}
                            tintColor="rgb(25, 153, 100)"
                        />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={stylesAdminTicketPage.claimItem}
                            onPress={() => handleClaimPress(item)}
                        >
                            <View style={stylesAdminTicketPage.claimHeader}>
                                <Text style={stylesAdminTicketPage.claimTitle}>{item.description}</Text>
                                <View style={stylesAdminTicketPage.statusContainer}>
                                    <View style={[
                                        stylesAdminTicketPage.typeBadge,
                                        { backgroundColor: item.listingId?.type === 'found' ? '#2196F3' : '#9C27B0' }
                                    ]}>
                                        <Text style={stylesAdminTicketPage.typeText}>
                                            {item.listingId?.type ? 
                                                item.listingId.type.charAt(0).toUpperCase() + item.listingId.type.slice(1) 
                                                : 'Unknown'}
                                        </Text>
                                    </View>
                                    <View style={[
                                        stylesAdminTicketPage.statusBadge,
                                        { backgroundColor: item.status === 'pending' ? '#FFA500' : 
                                                        item.status === 'approved' ? '#4CAF50' : '#F44336' }
                                    ]}>
                                        <Text style={stylesAdminTicketPage.statusText}>
                                            {item.status ? 
                                                item.status.charAt(0).toUpperCase() + item.status.slice(1)
                                                : 'Unknown'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={stylesAdminTicketPage.claimUser}>By: {item.userId?.name || 'Unknown User'}</Text>
                            <Text style={stylesAdminTicketPage.claimDate}>
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={stylesAdminTicketPage.listContainer}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedClaim(null);
                    setNotes('');
                }}
            >
                <View style={stylesAdminTicketPage.modalContainer}>
                    <View style={stylesAdminTicketPage.modalContent}>
                        <View style={stylesAdminTicketPage.modalHeader}>
                            <Text style={stylesAdminTicketPage.modalTitle}>Ticket Details</Text>
                            <TouchableOpacity
                                style={stylesAdminTicketPage.closeButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedClaim(null);
                                    setNotes('');
                                }}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={stylesAdminTicketPage.modalBody}>
                            {selectedClaim && (
                                <>
                                    <View style={stylesAdminTicketPage.modalSection}>
                                        <Text style={stylesAdminTicketPage.sectionTitle}>Listing</Text>
                                        <Text style={stylesAdminTicketPage.sectionContent}>{selectedClaim.listingId?.title || 'Unknown Listing'}</Text>
                                        <View style={stylesAdminTicketPage.statusContainer}>
                                            <View style={[
                                                stylesAdminTicketPage.typeBadge,
                                                { backgroundColor: selectedClaim.listingId?.type === 'found' ? '#2196F3' : '#9C27B0' }
                                            ]}>
                                                <Text style={stylesAdminTicketPage.typeText}>
                                                    {selectedClaim.listingId?.type ? 
                                                        selectedClaim.listingId.type.charAt(0).toUpperCase() + selectedClaim.listingId.type.slice(1) 
                                                        : 'Unknown'}
                                                </Text>
                                            </View>
                                            <View style={[
                                                stylesAdminTicketPage.statusBadge,
                                                { backgroundColor: selectedClaim.status === 'pending' ? '#FFA500' : 
                                                                selectedClaim.status === 'approved' ? '#4CAF50' : '#F44336' }
                                            ]}>
                                                <Text style={stylesAdminTicketPage.statusText}>
                                                    {selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={stylesAdminTicketPage.modalSection}>
                                        <Text style={stylesAdminTicketPage.sectionTitle}>Description</Text>
                                        <Text style={stylesAdminTicketPage.sectionContent}>{selectedClaim.description || 'No description provided'}</Text>
                                    </View>

                                    <View style={stylesAdminTicketPage.modalSection}>
                                        <Text style={stylesAdminTicketPage.sectionTitle}>Submitted By</Text>
                                        <Text style={stylesAdminTicketPage.sectionContent}>{selectedClaim.userId?.name || 'Unknown User'}</Text>
                                    </View>

                                    <View style={stylesAdminTicketPage.modalSection}>
                                        <Text style={stylesAdminTicketPage.sectionTitle}>Date Submitted</Text>
                                        <Text style={stylesAdminTicketPage.sectionContent}>
                                            {new Date(selectedClaim.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>

                                    {selectedClaim.proofImages && selectedClaim.proofImages.length > 0 && (
                                        <View style={stylesAdminTicketPage.modalSection}>
                                            <Text style={stylesAdminTicketPage.sectionTitle}>Proof Images</Text>
                                            <ScrollView horizontal style={stylesAdminTicketPage.imageScrollView}>
                                                {selectedClaim.proofImages.map((image, index) => (
                                                    <Image
                                                        key={index}
                                                        source={{ uri: image }}
                                                        style={stylesAdminTicketPage.proofImage}
                                                        resizeMode="cover"
                                                    />
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}

                                    <View style={stylesAdminTicketPage.modalSection}>
                                        <Text style={stylesAdminTicketPage.sectionTitle}>Admin Notes</Text>
                                        <TextInput
                                            style={stylesAdminTicketPage.notesInput}
                                            placeholder="Add notes..."
                                            value={notes}
                                            onChangeText={setNotes}
                                            multiline
                                        />
                                    </View>

                                    <View style={stylesAdminTicketPage.modalButtons}>
                                        <TouchableOpacity
                                            style={[stylesAdminTicketPage.modalButton, { backgroundColor: '#FFA500' }]}
                                            onPress={() => updateClaimStatus(selectedClaim._id, 'pending')}
                                        >
                                            <Text style={stylesAdminTicketPage.modalButtonText}>Pending</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[stylesAdminTicketPage.modalButton, { backgroundColor: '#4CAF50' }]}
                                            onPress={() => updateClaimStatus(selectedClaim._id, 'approved')}
                                        >
                                            <Text style={stylesAdminTicketPage.modalButtonText}>Approve</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[stylesAdminTicketPage.modalButton, { backgroundColor: '#F44336' }]}
                                            onPress={() => updateClaimStatus(selectedClaim._id, 'rejected')}
                                        >
                                            <Text style={stylesAdminTicketPage.modalButtonText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminTicketPage;
