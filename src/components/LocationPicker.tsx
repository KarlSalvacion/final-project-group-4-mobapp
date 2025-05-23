// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { Ionicons } from '@expo/vector-icons';

// interface LocationPickerProps {
//     onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void;
//     initialLocation?: { latitude: number; longitude: number };
// }

// const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
//     const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//     const [address, setAddress] = useState<string>('');
//     const [errorMsg, setErrorMsg] = useState<string | null>(null);

//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//                 return;
//             }

//             try {
//                 if (initialLocation) {
//                     setLocation(initialLocation);
//                     const [address] = await Location.reverseGeocodeAsync({
//                         latitude: initialLocation.latitude,
//                         longitude: initialLocation.longitude
//                     });
//                     if (address) {
//                         const addressString = [
//                             address.street,
//                             address.city,
//                             address.region,
//                             address.postalCode
//                         ].filter(Boolean).join(', ');
//                         setAddress(addressString);
//                     }
//                 } else {
//                     const currentLocation = await Location.getCurrentPositionAsync({});
//                     setLocation({
//                         latitude: currentLocation.coords.latitude,
//                         longitude: currentLocation.coords.longitude
//                     });
//                 }
//             } catch (error) {
//                 setErrorMsg('Error getting location');
//             }
//         })();
//     }, [initialLocation]);

//     const handleMapPress = async (e: any) => {
//         const { latitude, longitude } = e.nativeEvent.coordinate;
//         setLocation({ latitude, longitude });

//         try {
//             const [address] = await Location.reverseGeocodeAsync({
//                 latitude,
//                 longitude
//             });

//             if (address) {
//                 const addressString = [
//                     address.street,
//                     address.city,
//                     address.region,
//                     address.postalCode
//                 ].filter(Boolean).join(', ');
//                 setAddress(addressString);
//                 onLocationSelect({ latitude, longitude, address: addressString });
//             }
//         } catch (error) {
//             console.error('Error getting address:', error);
//         }
//     };

//     const handleUseCurrentLocation = async () => {
//         try {
//             const currentLocation = await Location.getCurrentPositionAsync({});
//             const { latitude, longitude } = currentLocation.coords;
//             setLocation({ latitude, longitude });

//             const [address] = await Location.reverseGeocodeAsync({
//                 latitude,
//                 longitude
//             });

//             if (address) {
//                 const addressString = [
//                     address.street,
//                     address.city,
//                     address.region,
//                     address.postalCode
//                 ].filter(Boolean).join(', ');
//                 setAddress(addressString);
//                 onLocationSelect({ latitude, longitude, address: addressString });
//             }
//         } catch (error) {
//             setErrorMsg('Error getting current location');
//         }
//     };

//     if (errorMsg) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>{errorMsg}</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <MapView
//                 provider={PROVIDER_GOOGLE}
//                 style={styles.map}
//                 initialRegion={location ? {
//                     latitude: location.latitude,
//                     longitude: location.longitude,
//                     latitudeDelta: 0.005,
//                     longitudeDelta: 0.005,
//                 } : undefined}
//                 onPress={handleMapPress}
//             >
//                 {location && (
//                     <Marker
//                         coordinate={{
//                             latitude: location.latitude,
//                             longitude: location.longitude,
//                         }}
//                     />
//                 )}
//             </MapView>
            
//             <View style={styles.controls}>
//                 <TouchableOpacity
//                     style={styles.currentLocationButton}
//                     onPress={handleUseCurrentLocation}
//                 >
//                     <Ionicons name="locate" size={24} color="#fff" />
//                 </TouchableOpacity>
//             </View>

//             {address && (
//                 <View style={styles.addressContainer}>
//                     <Text style={styles.addressText}>{address}</Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         width: '100%',
//         height: 300,
//         borderRadius: 8,
//         overflow: 'hidden',
//         marginVertical: 10,
//     },
//     map: {
//         width: '100%',
//         height: '100%',
//     },
//     controls: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//     },
//     currentLocationButton: {
//         backgroundColor: 'rgb(25, 153, 100)',
//         padding: 10,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     addressContainer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         padding: 10,
//     },
//     addressText: {
//         fontSize: 14,
//         color: '#333',
//     },
//     errorText: {
//         color: 'red',
//         textAlign: 'center',
//         padding: 20,
//     },
// });

// export default LocationPicker; 