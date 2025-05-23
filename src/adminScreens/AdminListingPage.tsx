import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    FlatList, 
    Text, 
    TouchableOpacity, 
    ActivityIndicator, 
    Image,
    Alert,
    Modal,
    ScrollView,
    Dimensions
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
    const [activeSlide, setActiveSlide] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

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

    const renderImage = ({ item }: { item: string }) => (
        <View style={[stylesAdminListingPage.carouselItem, { width: screenWidth * 0.8 }]}>
            <Image 
                source={{ uri: item }}
                style={stylesAdminListingPage.carouselImage}
                resizeMode="cover"
            />
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveSlide(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    useEffect(() => {
        fetchListings();
    }, []);

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

            {loading ? (
                <View style={[stylesAdminListingPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
                </View>
            ) : error ? (
                <View style={[stylesAdminListingPage.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                    <TouchableOpacity 
                        style={stylesAdminListingPage.retryButton}
                        onPress={fetchListings}
                    >
                        <Text style={stylesAdminListingPage.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
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
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedListing(null);
                }}
            >
                <View style={stylesAdminListingPage.modalOverlay}>
                    <View style={stylesAdminListingPage.modalContent}>
                        <View style={stylesAdminListingPage.modalHeader}>
                            <Text style={stylesAdminListingPage.modalTitle}>Listing Details</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedListing(null);
                                }}
                                style={stylesAdminListingPage.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {selectedListing && (
                            <ScrollView style={stylesAdminListingPage.modalScrollView}>
                                <View style={stylesAdminListingPage.imageContainer}>
                                    {selectedListing.images && selectedListing.images.length > 0 ? (
                                        <>
                                            <FlatList
                                                data={selectedListing.images}
                                                renderItem={renderImage}
                                                horizontal
                                                pagingEnabled
                                                showsHorizontalScrollIndicator={false}
                                                onViewableItemsChanged={onViewableItemsChanged}
                                                viewabilityConfig={viewabilityConfig}
                                                keyExtractor={(_, index) => index.toString()}
                                                style={stylesAdminListingPage.carousel}
                                            />
                                            {selectedListing.images.length > 1 && (
                                                <View style={stylesAdminListingPage.paginationContainer}>
                                                    {selectedListing.images.map((_, index) => (
                                                        <View
                                                            key={index}
                                                            style={[
                                                                stylesAdminListingPage.paginationDot,
                                                                index === activeSlide && stylesAdminListingPage.paginationDotActive
                                                            ]}
                                                        />
                                                    ))}
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View style={[stylesAdminListingPage.modalImage, stylesAdminListingPage.noImageContainer]}>
                                            <Ionicons name="image-outline" size={40} color="#999" />
                                        </View>
                                    )}
                                </View>

                                <View style={stylesAdminListingPage.detailsContainer}>
                                    <Text style={stylesAdminListingPage.modalTitle}>{selectedListing.title}</Text>
                                    <Text style={stylesAdminListingPage.modalDescription}>{selectedListing.description}</Text>
                                    
                                    <View style={stylesAdminListingPage.detailRow}>
                                        <Ionicons name="location-outline" size={20} color="#666" />
                                        <Text style={stylesAdminListingPage.detailText}>{selectedListing.location}</Text>
                                    </View>
                                    
                                    <View style={stylesAdminListingPage.detailRow}>
                                        <Ionicons name="calendar-outline" size={20} color="#666" />
                                        <Text style={stylesAdminListingPage.detailText}>
                                            {new Date(selectedListing.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    
                                    <View style={stylesAdminListingPage.detailRow}>
                                        <Ionicons name="time-outline" size={20} color="#666" />
                                        <Text style={stylesAdminListingPage.detailText}>{selectedListing.time}</Text>
                                    </View>
                                    
                                    <View style={stylesAdminListingPage.detailRow}>
                                        <Ionicons name="person-outline" size={20} color="#666" />
                                        <Text style={stylesAdminListingPage.detailText}>{selectedListing.userId.name}</Text>
                                    </View>
                                    
                                    <View style={stylesAdminListingPage.detailRow}>
                                        <Ionicons name="flag-outline" size={20} color="#666" />
                                        <Text style={stylesAdminListingPage.detailText}>
                                            Status: {selectedListing.status.charAt(0).toUpperCase() + selectedListing.status.slice(1)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={stylesAdminListingPage.actionButtons}>
                                    <TouchableOpacity
                                        style={[stylesAdminListingPage.actionButton, { backgroundColor: '#4CAF50' }]}
                                        onPress={() => updateListingStatus(selectedListing._id, 'active')}
                                    >
                                        <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                        <Text style={stylesAdminListingPage.actionButtonText}>Set Active</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[stylesAdminListingPage.actionButton, { backgroundColor: '#FFA500' }]}
                                        onPress={() => updateListingStatus(selectedListing._id, 'claimed')}
                                    >
                                        <Ionicons name="flag-outline" size={20} color="white" />
                                        <Text style={stylesAdminListingPage.actionButtonText}>Set Claimed</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[stylesAdminListingPage.actionButton, { backgroundColor: '#F44336' }]}
                                        onPress={() => updateListingStatus(selectedListing._id, 'closed')}
                                    >
                                        <Ionicons name="close-circle-outline" size={20} color="white" />
                                        <Text style={stylesAdminListingPage.actionButtonText}>Set Closed</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminListingPage;
