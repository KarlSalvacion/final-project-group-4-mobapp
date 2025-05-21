import React, { useState, useEffect } from 'react';
import { 
    View, 
    FlatList, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    Image,
    Alert,
    Modal,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import { Listing } from '../types';
import stylesAdminListingPage from '../styles/admin/StyleListingPage';
import { Ionicons } from '@expo/vector-icons';

const AdminListingPage = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('jwtToken');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/listings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const { success, listings: fetchedListings } = await response.json();
            if (success) {
                setListings(fetchedListings);
            } else {
                throw new Error('Failed to fetch listings');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching listings';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateListingStatus = async (listingId: string, status: 'active' | 'claimed' | 'closed') => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${BACKEND_BASE_URL}/api/admin/listings/${listingId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update listing');
            }

            const { success, listing } = await response.json();
            if (success) {
                Alert.alert('Success', 'Listing status updated successfully');
                setModalVisible(false);
                setSelectedListing(null);
                fetchListings();
            } else {
                throw new Error('Failed to update listing');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating listing';
            Alert.alert('Error', errorMessage);
        }
    };

    const handleListingPress = (listing: Listing) => {
        setSelectedListing(listing);
        setModalVisible(true);
    };

    useEffect(() => {
        fetchListings();
    }, []);

    if (loading) {
        return (
            <View style={[stylesAdminListingPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[stylesAdminListingPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity 
                    style={stylesAdminListingPage.retryButton}
                    onPress={fetchListings}
                >
                    <Text style={stylesAdminListingPage.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={stylesAdminListingPage.mainContainer}>
            <View style={stylesAdminListingPage.headerContainer}>
                <View style={stylesAdminListingPage.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminListingPage.headerLogo}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <FlatList
                data={listings}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={stylesAdminListingPage.listingItem}
                        onPress={() => handleListingPress(item)}
                    >
                        <View style={stylesAdminListingPage.listingHeader}>
                            <Text style={stylesAdminListingPage.listingTitle}>{item.title}</Text>
                            <View style={[
                                stylesAdminListingPage.statusBadge,
                                { 
                                    backgroundColor: 
                                        item.status === 'active' ? '#4CAF50' : 
                                        item.status === 'claimed' ? '#FFA500' : '#F44336' 
                                }
                            ]}>
                                <Text style={stylesAdminListingPage.statusText}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </Text>
                            </View>
                        </View>
                        <Text style={stylesAdminListingPage.listingDescription}>{item.description}</Text>
                        <Text style={stylesAdminListingPage.listingUser}>By: {item.userId.name}</Text>
                        <Text style={stylesAdminListingPage.listingDate}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={stylesAdminListingPage.listContainer}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedListing(null);
                }}
            >
                <View style={stylesAdminListingPage.modalContainer}>
                    <View style={stylesAdminListingPage.modalContent}>
                        <Text style={stylesAdminListingPage.modalTitle}>Listing Details</Text>
                        {selectedListing && (
                            <>
                                <ScrollView horizontal style={stylesAdminListingPage.imageScrollView}>
                                    {selectedListing.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: image }}
                                            style={stylesAdminListingPage.listingImage}
                                            resizeMode="cover"
                                        />
                                    ))}
                                </ScrollView>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Title: {selectedListing.title}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Description: {selectedListing.description}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Type: {selectedListing.type}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Category: {selectedListing.category}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Location: {selectedListing.location}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Date: {new Date(selectedListing.date).toLocaleDateString()}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Time: {selectedListing.time}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    User: {selectedListing.userId.name}
                                </Text>
                                <Text style={stylesAdminListingPage.modalText}>
                                    Status: {selectedListing.status}
                                </Text>
                                <View style={stylesAdminListingPage.modalButtons}>
                                    <TouchableOpacity
                                        style={[stylesAdminListingPage.modalButton, { backgroundColor: '#4CAF50' }]}
                                        onPress={() => updateListingStatus(selectedListing._id, 'active')}
                                    >
                                        <Text style={stylesAdminListingPage.modalButtonText}>Set Active</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[stylesAdminListingPage.modalButton, { backgroundColor: '#FFA500' }]}
                                        onPress={() => updateListingStatus(selectedListing._id, 'claimed')}
                                    >
                                        <Text style={stylesAdminListingPage.modalButtonText}>Set Claimed</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[stylesAdminListingPage.modalButton, { backgroundColor: '#F44336' }]}
                                        onPress={() => updateListingStatus(selectedListing._id, 'closed')}
                                    >
                                        <Text style={stylesAdminListingPage.modalButtonText}>Set Closed</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                        <TouchableOpacity
                            style={stylesAdminListingPage.closeButton}
                            onPress={() => {
                                setModalVisible(false);
                                setSelectedListing(null);
                            }}
                        >
                            <Text style={stylesAdminListingPage.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminListingPage;
