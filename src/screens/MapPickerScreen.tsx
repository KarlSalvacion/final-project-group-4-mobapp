import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const MapPickerScreen = () => {
    const navigation = useNavigation();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
        address?: string;
    } | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Please enable location services to use this feature.'
                );
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    const handleMapPress = async (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        
        try {
            // Get address from coordinates
            const [address] = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            if (address) {
                const locationString = [
                    address.street,
                    address.city,
                    address.region,
                    address.postalCode
                ].filter(Boolean).join(', ');

                setSelectedLocation({
                    latitude,
                    longitude,
                    address: locationString
                });
            } else {
                setSelectedLocation({
                    latitude,
                    longitude
                });
            }
        } catch (error) {
            console.error('Error getting address:', error);
            setSelectedLocation({
                latitude,
                longitude
            });
        }
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            // @ts-ignore
            navigation.navigate('AddListing', {
                selectedLocation: selectedLocation.address || 
                    `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`,
                coordinates: {
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude
                }
            });
        } else {
            Alert.alert('Error', 'Please select a location on the map');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Location</Text>
            </View>

            <MapView
                provider={PROVIDER_GOOGLE}
                mapType='satellite'
                style={styles.map}
                initialRegion={location ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                } : undefined}
                onPress={handleMapPress}
            >
                {selectedLocation && (
                    <Marker
                        coordinate={{
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude
                        }}
                    />
                )}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.selectedLocation}>
                    {selectedLocation?.address || 
                     (selectedLocation ? 
                        `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}` : 
                        'Tap on the map to select a location')}
                </Text>
                <TouchableOpacity
                    style={[styles.confirmButton, !selectedLocation && styles.confirmButtonDisabled]}
                    onPress={handleConfirm}
                    disabled={!selectedLocation}
                >
                    <Text style={styles.confirmButtonText}>Confirm Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    selectedLocation: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: 'rgb(25, 153, 100)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#ccc',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MapPickerScreen; 