import React, { useState, useEffect } from 'react';
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
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import stylesAdminTicketPage from '../styles/admin/StyleTicketPage';
import { Ionicons } from '@expo/vector-icons';

interface Claim {
    _id: string;
    listingId: {
        title: string;
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

const AdminTicketPage = () => {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

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

    const updateClaimStatus = async (claimId: string, status: 'approved' | 'rejected') => {
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

            {filteredClaims.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#888', fontSize: 18, fontWeight: '500' }}>No tickets available</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredClaims}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={stylesAdminTicketPage.claimItem}
                            onPress={() => handleClaimPress(item)}
                        >
                            <View style={stylesAdminTicketPage.claimHeader}>
                                <Text style={stylesAdminTicketPage.claimTitle}>{item.description}</Text>
                                <View style={[
                                    stylesAdminTicketPage.statusBadge,
                                    { backgroundColor: item.status === 'pending' ? '#FFA500' : 
                                                    item.status === 'approved' ? '#4CAF50' : '#F44336' }
                                ]}>
                                    <Text style={stylesAdminTicketPage.statusText}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={stylesAdminTicketPage.claimUser}>By: {item.userId.name}</Text>
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
                        <Text style={stylesAdminTicketPage.modalTitle}>Claim Details</Text>
                        {selectedClaim && (
                            <>
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
                                <Text style={stylesAdminTicketPage.modalText}>
                                    Description: {selectedClaim.description}
                                </Text>
                                <Text style={stylesAdminTicketPage.modalText}>
                                    User: {selectedClaim.userId.name}
                                </Text>
                                <Text style={stylesAdminTicketPage.modalText}>
                                    Status: {selectedClaim.status}
                                </Text>
                                <Text style={stylesAdminTicketPage.modalText}>
                                    Listing: {selectedClaim.listingId.title}
                                </Text>
                                <TextInput
                                    style={stylesAdminTicketPage.notesInput}
                                    placeholder="Add notes..."
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline
                                />
                                <View style={stylesAdminTicketPage.modalButtons}>
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
                        <TouchableOpacity
                            style={stylesAdminTicketPage.closeButton}
                            onPress={() => {
                                setModalVisible(false);
                                setSelectedClaim(null);
                                setNotes('');
                            }}
                        >
                            <Text style={stylesAdminTicketPage.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminTicketPage;
