import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, FlatList } from 'react-native';
import { stylesDetailedItemListing } from '../styles/StylesDetailedItemListing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useListings } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import * as ImagePicker from 'expo-image-picker';
import { Listing, Claim } from '../types';
import ImageCarousel from '../components/ImageCarousel';

type RootStackParamList = {
    DetailedItemListing: { listingId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DetailedItemListingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { listings } = useListings();
    const { token, user } = useAuth();
    const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
    const [isFoundModalVisible, setIsFoundModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImages, setEditImages] = useState<string[]>([]);
    const [claimExplanation, setClaimExplanation] = useState('');
    const [foundExplanation, setFoundExplanation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofImages, setProofImages] = useState<string[]>([]);
    const [foundImages, setFoundImages] = useState<string[]>([]);
    const [userClaims, setUserClaims] = useState<Claim[]>([]);
    const [isLoadingClaims, setIsLoadingClaims] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');
    
    // @ts-ignore - We know listingId exists in params
    const listingId = route.params?.listingId;
    const listing = listings.find(l => l._id === listingId);

    const hasExistingClaim = userClaims.some(
        claim => claim.listingId === listingId && claim.status === 'pending'
    );

    useEffect(() => {
        const fetchUserClaims = async () => {
            try {
                setIsLoadingClaims(true);
                const response = await fetch(`${BACKEND_BASE_URL}/api/claims/my-claims`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch claims');
                }

                const claims = await response.json();
                console.log('Fetched claims:', claims);
                setUserClaims(claims);
            } catch (error) {
                console.error('Error fetching claims:', error);
            } finally {
                setIsLoadingClaims(false);
            }
        };

        if (token && listingId) {
            fetchUserClaims();
        }
    }, [token, listingId]);

    const pickImage = async (isFound: boolean = false) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            if (isFound) {
                setFoundImages([...foundImages, result.assets[0].uri]);
            } else {
                setProofImages([...proofImages, result.assets[0].uri]);
            }
        }
    };

    const removeImage = (index: number, isFound: boolean = false) => {
        if (isFound) {
            setFoundImages(foundImages.filter((_, i) => i !== index));
        } else {
            setProofImages(proofImages.filter((_, i) => i !== index));
        }
    };

    const handleClaim = async () => {
        if (!listing) {
            Alert.alert('Error', 'Listing not found.');
            return;
        }

        if (!claimExplanation.trim()) {
            Alert.alert('Error', 'Please provide an explanation for your claim.');
            return;
        }

        // Only require images for found items
        if (listing.type === 'found' && proofImages.length === 0) {
            Alert.alert('Error', 'Please provide at least one proof image.');
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('listingId', listing._id);
            formData.append('description', claimExplanation);

            proofImages.forEach((uri, index) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('proofImages', {
                    uri,
                    name: filename,
                    type,
                } as any);
            });

            const response = await fetch(`${BACKEND_BASE_URL}/api/claims`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit claim');
            }

            const newClaim = await response.json();
            setUserClaims([...userClaims, newClaim]);

            Alert.alert(
                'Success',
                'Your claim has been submitted successfully. The owner will review your claim.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setIsClaimModalVisible(false);
                            setClaimExplanation('');
                            setProofImages([]);
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to submit claim. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFound = async () => {
        if (!listing) {
            Alert.alert('Error', 'Listing not found.');
            return;
        }

        if (!foundExplanation.trim()) {
            Alert.alert('Error', 'Please provide details about where you found the item.');
            return;
        }

        if (foundImages.length === 0) {
            Alert.alert('Error', 'Please provide at least one image of the found item.');
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('listingId', listing._id);
            formData.append('description', foundExplanation);
            formData.append('type', 'found'); // Add type to distinguish from claims

            foundImages.forEach((uri, index) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('proofImages', {
                    uri,
                    name: filename,
                    type,
                } as any);
            });

            const response = await fetch(`${BACKEND_BASE_URL}/api/claims`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit found item');
            }

            const newClaim = await response.json();
            setUserClaims([...userClaims, newClaim]);

            Alert.alert(
                'Success',
                'Thank you for reporting that you found this item. The owner will be notified.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setIsFoundModalVisible(false);
                            setFoundExplanation('');
                            setFoundImages([]);
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to submit found item. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add this function to check if user is the owner
    const isUserOwner = () => {
        console.log('User:', user);
        console.log('Listing:', listing);
        if (!user || !listing) return false;
        const listingUserId = typeof listing.userId === 'object' ? listing.userId._id : listing.userId;
        const userId = user._id || user.id; // Handle both _id and id
        console.log('Listing User ID:', listingUserId);
        console.log('Current User ID:', userId);
        return String(listingUserId) === String(userId);
    };

    // Add this function to handle claim/found submission
    const handleSubmit = async (isFound: boolean = false) => {
        console.log('Handle Submit - User:', user);
        console.log('Handle Submit - Token:', token);
        
        if (!user || (!user._id && !user.id)) {
            Alert.alert(
                'Error',
                'Please log in to claim or report items.',
                [{ text: 'OK' }]
            );
            return;
        }

        if (isUserOwner()) {
            Alert.alert(
                'Not Allowed',
                'You cannot claim or report finding your own items.',
                [{ text: 'OK' }]
            );
            return;
        }

        if (isFound) {
            setIsFoundModalVisible(true);
        } else {
            setIsClaimModalVisible(true);
        }
    };

    // Add this function to handle listing deletion
    const handleDelete = async () => {
        if (!listing) return;

        Alert.alert(
            'Delete Listing',
            'Are you sure you want to delete this listing? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BACKEND_BASE_URL}/api/listings/${listing._id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Failed to delete listing');
                            }

                            Alert.alert('Success', 'Listing deleted successfully');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                error instanceof Error ? error.message : 'Failed to delete listing'
                            );
                        }
                    }
                }
            ]
        );
    };

    // Add this function to handle image upload in edit mode
    const pickEditImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            setEditImages([...editImages, result.assets[0].uri]);
        }
    };

    const removeEditImage = (index: number) => {
        setEditImages(editImages.filter((_, i) => i !== index));
    };

    // Update handleUpdate function
    const handleUpdate = async () => {
        if (!listing) return;

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            
            if (editTitle) formData.append('title', editTitle);
            if (editDescription) formData.append('description', editDescription);

            editImages.forEach((uri) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('images', {
                    uri,
                    name: filename,
                    type,
                } as any);
            });

            const response = await fetch(`${BACKEND_BASE_URL}/api/listings/${listing._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update listing');
            }

            Alert.alert('Success', 'Listing updated successfully');
            setIsEditModalVisible(false);
            navigation.goBack();
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to update listing'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update useEffect to set initial values when edit modal opens
    useEffect(() => {
        if (isEditModalVisible && listing) {
            setEditTitle(listing.title);
            setEditDescription(listing.description);
            setEditImages(listing.images);
        }
    }, [isEditModalVisible, listing]);

    if (!listing) {
        return (
            <View style={stylesDetailedItemListing.mainContainer}>
                <Text>Listing not found</Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={stylesDetailedItemListing.mainContainer}>
                <View style={stylesDetailedItemListing.headerContainer}>
                    <TouchableOpacity 
                        style={stylesDetailedItemListing.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={stylesDetailedItemListing.headerTitle}>Item Details</Text>
                </View>
                
                <ScrollView style={stylesDetailedItemListing.scrollContainer}>
                    {listing.images.length > 0 && (
                        <View style={stylesDetailedItemListing.imageContainer}>
                            <ImageCarousel images={listing.images} />
                        </View>
                    )}
                    
                    <View style={stylesDetailedItemListing.contentContainer}>
                        <View style={stylesDetailedItemListing.titleContainer}>
                            <Text style={stylesDetailedItemListing.title}>{listing.title}</Text>
                            <Text style={[
                                stylesDetailedItemListing.typeText,
                                listing.type === 'found' ? stylesDetailedItemListing.typeFound : stylesDetailedItemListing.typeLost
                            ]}>
                                {listing.type.toUpperCase()}
                            </Text>
                        </View>
                        <Text style={stylesDetailedItemListing.description}>{listing.description}</Text>
                        
                        <View style={stylesDetailedItemListing.detailsContainer}>
                            <Ionicons name="person-outline" style={stylesDetailedItemListing.icon} />
                            <Text style={stylesDetailedItemListing.detailText}>
                                Posted by {listing.userId?.name || listing.userId?.username || 'Anonymous'}
                            </Text>
                        </View>

                        <View style={stylesDetailedItemListing.detailsContainer}>
                            <Ionicons name="location" style={stylesDetailedItemListing.icon} />
                            <Text style={stylesDetailedItemListing.detailText}>{listing.location}</Text>
                        </View>
                        
                        <View style={stylesDetailedItemListing.detailsContainer}>
                            <Ionicons name="calendar" style={stylesDetailedItemListing.icon} />
                            <Text style={stylesDetailedItemListing.detailText}>
                                {new Date(listing.date).toLocaleDateString()} at around {listing.time}
                            </Text>
                        </View>

                        {!isUserOwner() && (
                            listing.type === 'found' ? (
                                <TouchableOpacity
                                    style={[
                                        stylesDetailedItemListing.claimButton,
                                        (hasExistingClaim || isLoadingClaims) && stylesDetailedItemListing.claimButtonDisabled
                                    ]}
                                    onPress={() => handleSubmit(false)}
                                    disabled={hasExistingClaim || isLoadingClaims}
                                >
                                    {isLoadingClaims ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={stylesDetailedItemListing.claimButtonText}>
                                            {hasExistingClaim ? 'Claim Pending' : 'Claim This Item'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        stylesDetailedItemListing.claimButton,
                                        (hasExistingClaim || isLoadingClaims) && stylesDetailedItemListing.claimButtonDisabled
                                    ]}
                                    onPress={() => handleSubmit(true)}
                                    disabled={hasExistingClaim || isLoadingClaims}
                                >
                                    {isLoadingClaims ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={stylesDetailedItemListing.claimButtonText}>
                                            {hasExistingClaim ? 'Found Pending' : 'I Found This Item'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )
                        )}

                        {isUserOwner() && (
                            <View style={stylesDetailedItemListing.ownerButtonsContainer}>
                                <TouchableOpacity
                                    style={[stylesDetailedItemListing.claimButton, { flex: 1, marginRight: 5 }]}
                                    onPress={() => setIsEditModalVisible(true)}
                                >
                                    <Text style={stylesDetailedItemListing.claimButtonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[stylesDetailedItemListing.claimButton, { flex: 1, marginLeft: 5, backgroundColor: '#e74c3c' }]}
                                    onPress={handleDelete}
                                >
                                    <Text style={stylesDetailedItemListing.claimButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Claim Modal */}
                <Modal
                    visible={isClaimModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsClaimModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        setIsClaimModalVisible(false);
                    }}>
                        <View style={stylesDetailedItemListing.modalContainer}>
                            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                <KeyboardAvoidingView 
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={stylesDetailedItemListing.modalContent}
                                >
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <View>
                                            <Text style={stylesDetailedItemListing.modalTitle}>Claim This Item</Text>
                                            <Text style={stylesDetailedItemListing.modalSubtitle}>
                                                {listing.type === 'found' 
                                                    ? 'Please provide details about why you believe this item belongs to you.'
                                                    : 'Please provide details about why you believe this is your lost item.'}
                                            </Text>
                                            
                                            <TextInput
                                                style={stylesDetailedItemListing.claimInput}
                                                multiline
                                                numberOfLines={6}
                                                placeholder="Explain why this item belongs to you..."
                                                placeholderTextColor={'#999'}
                                                autoCapitalize="sentences"
                                                value={claimExplanation}
                                                onChangeText={setClaimExplanation}
                                                selectionColor={'rgba(25, 153, 100, 1)'}
                                            />

                                            <View style={stylesDetailedItemListing.imageUploadContainer}>
                                                <Text style={stylesDetailedItemListing.imageUploadTitle}>
                                                    Proof Images {listing.type === 'lost' && '(Optional)'}
                                                </Text>
                                                <TouchableOpacity
                                                    style={stylesDetailedItemListing.imageUploadButton}
                                                    onPress={() => pickImage(false)}
                                                    disabled={proofImages.length >= 3}
                                                >
                                                    <Ionicons name="camera" size={24} color="#fff" />
                                                    <Text style={stylesDetailedItemListing.imageUploadButtonText}>
                                                        Add Image
                                                    </Text>
                                                </TouchableOpacity>

                                                <View style={stylesDetailedItemListing.imagePreviewContainer}>
                                                    {proofImages.map((uri, index) => (
                                                        <View key={index} style={stylesDetailedItemListing.imagePreviewWrapper}>
                                                            <Image
                                                                source={{ uri }}
                                                                style={stylesDetailedItemListing.imagePreview}
                                                            />
                                                            <TouchableOpacity
                                                                style={stylesDetailedItemListing.removeImageButton}
                                                                onPress={() => removeImage(index, false)}
                                                            >
                                                                <Ionicons name="close-circle" size={24} color="#fff" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>

                                            <View style={stylesDetailedItemListing.modalButtons}>
                                                <TouchableOpacity
                                                    style={[stylesDetailedItemListing.modalButton, stylesDetailedItemListing.cancelButton]}
                                                    onPress={() => {
                                                        setIsClaimModalVisible(false);
                                                        setClaimExplanation('');
                                                        setProofImages([]);
                                                    }}
                                                    disabled={isSubmitting}
                                                >
                                                    <Text style={stylesDetailedItemListing.modalCancelButtonText}>Cancel</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[stylesDetailedItemListing.modalButton, stylesDetailedItemListing.submitButton]}
                                                    onPress={handleClaim}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <ActivityIndicator color="#fff" />
                                                    ) : (
                                                        <Text style={stylesDetailedItemListing.modalButtonText}>Submit Claim</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Found Modal */}
                <Modal
                    visible={isFoundModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsFoundModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        setIsFoundModalVisible(false);
                    }}>
                        <View style={stylesDetailedItemListing.modalContainer}>
                            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                <KeyboardAvoidingView 
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={stylesDetailedItemListing.modalContent}
                                >
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <View>
                                            <Text style={stylesDetailedItemListing.modalTitle}>I Found This Item</Text>
                                            <Text style={stylesDetailedItemListing.modalSubtitle}>
                                                Please provide details about where and how you found this item.
                                            </Text>
                                            
                                            <TextInput
                                                style={stylesDetailedItemListing.claimInput}
                                                multiline
                                                numberOfLines={6}
                                                placeholder="Describe where and how you found this item..."
                                                value={foundExplanation}
                                                onChangeText={setFoundExplanation}
                                            />

                                            <View style={stylesDetailedItemListing.imageUploadContainer}>
                                                <Text style={stylesDetailedItemListing.imageUploadTitle}>
                                                    Images (Optional)
                                                </Text>
                                                <TouchableOpacity
                                                    style={stylesDetailedItemListing.imageUploadButton}
                                                    onPress={() => pickImage(true)}
                                                    disabled={foundImages.length >= 3}
                                                >
                                                    <Ionicons name="camera" size={24} color="#fff" />
                                                    <Text style={stylesDetailedItemListing.imageUploadButtonText}>
                                                        Add Image
                                                    </Text>
                                                </TouchableOpacity>

                                                <View style={stylesDetailedItemListing.imagePreviewContainer}>
                                                    {foundImages.map((uri, index) => (
                                                        <View key={index} style={stylesDetailedItemListing.imagePreviewWrapper}>
                                                            <Image
                                                                source={{ uri }}
                                                                style={stylesDetailedItemListing.imagePreview}
                                                            />
                                                            <TouchableOpacity
                                                                style={stylesDetailedItemListing.removeImageButton}
                                                                onPress={() => removeImage(index, true)}
                                                            >
                                                                <Ionicons name="close-circle" size={24} color="#fff" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>

                                            <View style={stylesDetailedItemListing.modalButtons}>
                                                <TouchableOpacity
                                                    style={[stylesDetailedItemListing.modalButton, stylesDetailedItemListing.cancelButton]}
                                                    onPress={() => {
                                                        setIsFoundModalVisible(false);
                                                        setFoundExplanation('');
                                                        setFoundImages([]);
                                                    }}
                                                    disabled={isSubmitting}
                                                >
                                                    <Text style={stylesDetailedItemListing.modalCancelButtonText}>Cancel</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[stylesDetailedItemListing.modalButton, stylesDetailedItemListing.submitButton]}
                                                    onPress={handleFound}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <ActivityIndicator color="#fff" />
                                                    ) : (
                                                        <Text style={stylesDetailedItemListing.modalButtonText}>Submit</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    visible={isEditModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsEditModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => {
                        Keyboard.dismiss();
                        setIsEditModalVisible(false);
                    }}>
                        <View style={stylesDetailedItemListing.modalContainer}>
                            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                <KeyboardAvoidingView 
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={stylesDetailedItemListing.modalContent}
                                >
                                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                        <View>
                                            <Text style={stylesDetailedItemListing.modalTitle}>Edit Listing</Text>
                                            <Text style={stylesDetailedItemListing.modalSubtitle}>
                                                Update your listing details below
                                            </Text>
                                            
                                            <View style={stylesDetailedItemListing.formGroup}>
                                                <Text style={stylesDetailedItemListing.formLabel}>Title</Text>
                                                <TextInput
                                                    style={stylesDetailedItemListing.claimInput}
                                                    placeholder="Enter item title"
                                                    value={editTitle}
                                                    onChangeText={setEditTitle}
                                                />
                                            </View>

                                            <View style={stylesDetailedItemListing.formGroup}>
                                                <Text style={stylesDetailedItemListing.formLabel}>Description</Text>
                                                <TextInput
                                                    style={stylesDetailedItemListing.claimInput}
                                                    multiline
                                                    numberOfLines={4}
                                                    placeholder="Describe your item..."
                                                    value={editDescription}
                                                    onChangeText={setEditDescription}
                                                />
                                            </View>

                                            <View style={stylesDetailedItemListing.formGroup}>
                                                <Text style={stylesDetailedItemListing.formLabel}>Images</Text>
                                                <Text style={stylesDetailedItemListing.formSubLabel}>
                                                    Add up to 3 images of your item
                                                </Text>
                                                <TouchableOpacity
                                                    style={stylesDetailedItemListing.imageUploadButton}
                                                    onPress={pickEditImage}
                                                    disabled={editImages.length >= 3}
                                                >
                                                    <Ionicons name="camera" size={24} color="#fff" />
                                                    <Text style={stylesDetailedItemListing.imageUploadButtonText}>
                                                        Add Image
                                                    </Text>
                                                </TouchableOpacity>

                                                <View style={stylesDetailedItemListing.imagePreviewContainer}>
                                                    {editImages.map((uri, index) => (
                                                        <View key={index} style={stylesDetailedItemListing.imagePreviewWrapper}>
                                                            <Image
                                                                source={{ uri }}
                                                                style={stylesDetailedItemListing.imagePreview}
                                                            />
                                                            <TouchableOpacity
                                                                style={stylesDetailedItemListing.removeImageButton}
                                                                onPress={() => removeEditImage(index)}
                                                            >
                                                                <Ionicons name="close-circle" size={24} color="#fff" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>

                                            <View style={stylesDetailedItemListing.modalButtons}>
                                                <TouchableOpacity
                                                    style={[stylesDetailedItemListing.modalButton, stylesDetailedItemListing.cancelButton]}
                                                    onPress={() => {
                                                        setIsEditModalVisible(false);
                                                        setEditTitle('');
                                                        setEditDescription('');
                                                        setEditImages([]);
                                                    }}
                                                    disabled={isSubmitting}
                                                >
                                                    <Text style={stylesDetailedItemListing.modalCancelButtonText}>Cancel</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[stylesDetailedItemListing.modalButton, stylesDetailedItemListing.submitButton]}
                                                    onPress={handleUpdate}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <ActivityIndicator color="#fff" />
                                                    ) : (
                                                        <Text style={stylesDetailedItemListing.modalButtonText}>Save Changes</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </KeyboardAvoidingView>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default DetailedItemListingScreen;