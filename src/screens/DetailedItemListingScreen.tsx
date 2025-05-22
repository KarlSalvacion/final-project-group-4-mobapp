import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { stylesDetailedItemListing } from '../styles/StylesDetailedItemListing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useListings } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import * as ImagePicker from 'expo-image-picker';

type RootStackParamList = {
    DetailedItemListing: { listingId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Claim {
    _id: string;
    listingId: string;
    status: 'pending' | 'approved' | 'rejected';
}

const DetailedItemListingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { listings } = useListings();
    const { token } = useAuth();
    const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
    const [claimExplanation, setClaimExplanation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofImages, setProofImages] = useState<string[]>([]);
    const [userClaims, setUserClaims] = useState<Claim[]>([]);
    const [isLoadingClaims, setIsLoadingClaims] = useState(true);
    
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
                console.log('Fetched claims:', claims); // Debug log
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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            setProofImages([...proofImages, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        setProofImages(proofImages.filter((_, i) => i !== index));
    };

    const handleClaim = async () => {
        if (!claimExplanation.trim()) {
            Alert.alert('Error', 'Please provide an explanation for your claim.');
            return;
        }

        if (proofImages.length === 0) {
            Alert.alert('Error', 'Please provide at least one proof image.');
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('listingId', listing?._id || '');
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

            // Add the new claim to userClaims
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
                            <Image 
                                source={{ uri: listing.images[0] }}
                                style={stylesDetailedItemListing.image}
                            />
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
                                Posted by {listing.userId?.name || 'Anonymous'}
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

                        {listing.type === 'found' && (
                            <TouchableOpacity
                                style={[
                                    stylesDetailedItemListing.claimButton,
                                    (hasExistingClaim || isLoadingClaims) && stylesDetailedItemListing.claimButtonDisabled
                                ]}
                                onPress={() => setIsClaimModalVisible(true)}
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
                        )}
                    </View>
                </ScrollView>

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
                                                Please provide details about why you believe this item belongs to you.
                                            </Text>
                                            
                                            <TextInput
                                                style={stylesDetailedItemListing.claimInput}
                                                multiline
                                                numberOfLines={6}
                                                placeholder="Explain why this item belongs to you..."
                                                value={claimExplanation}
                                                onChangeText={setClaimExplanation}
                                            />

                                            <View style={stylesDetailedItemListing.imageUploadContainer}>
                                                <Text style={stylesDetailedItemListing.imageUploadTitle}>Proof Images</Text>
                                                <TouchableOpacity
                                                    style={stylesDetailedItemListing.imageUploadButton}
                                                    onPress={pickImage}
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
                                                                onPress={() => removeImage(index)}
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
            </View>
        </TouchableWithoutFeedback>
    );
};

export default DetailedItemListingScreen;

