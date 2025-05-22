import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stylesAddListingScreen } from '../styles/StylesAddListingScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import ImagePreview from '../components/ImagePreview';
import { listingValidationSchema } from '../validation/ValidationSchema';
import { useListings } from '../context/ListingContext';
import { ListingType, Listing } from '../types';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { listingService } from '../services/listingService';
import DatePickerComponent from '../components/DatePickerComponent';
import TimePickerComponent from '../components/TimePickerComponent';

type RootStackParamList = {
    Home: undefined;
    AddListing: undefined;
};

type FormValues = {
    listingType: ListingType;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    images: string[];
    category: string;
};

const CATEGORIES = [
    'clothes',
    'electronics',
    'accessories',
    'documents',
    'books',
    'jewelry',
    'bags',
    'other'
];

const AddListingScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { addListing } = useListings();
    const { token } = useAuth();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [tempCategory, setTempCategory] = useState('');
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [tempTime, setTempTime] = useState<Date>(new Date());
    const [formRef, setFormRef] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        })();
    }, []);

    const getCurrentLocation = async () => {
        try {
            if (!locationPermission) {
                Alert.alert(
                    "Location Permission Required",
                    "Please enable location services to automatically get your location for found items."
                );
                return null;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            
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
                return locationString;
            }
            return `${latitude}, ${longitude}`;
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert(
                "Location Error",
                "Failed to get your current location. Please enter the location manually."
            );
            return null;
        }
    };

    const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        if (!token) {
            Alert.alert(
                "Authentication Error",
                "Please log in to create a listing."
            );
            return;
        }

        if (!values.date || !values.time) {
            Alert.alert(
                "Validation Error",
                "Please select both date and time before submitting."
            );
            return;
        }

        try {
            // Create FormData for multipart/form-data
            const formData = new FormData();
            
            // Append images
            values.images.forEach((imageUri, index) => {
                formData.append('images', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: `image${index}.jpg`,
                } as any);
            });

            // Append all required fields
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('type', values.listingType);
            formData.append('category', values.category);
            formData.append('location', values.location);
            formData.append('date', values.date);
            formData.append('time', values.time);

            const newListing = await listingService.createListing(formData);
            
            // After successful creation, update the listings in context
            await addListing({
                title: values.title,
                description: values.description,
                type: values.listingType,
                category: values.category,
                location: values.location,
                date: values.date,
                time: values.time,
                images: values.images,
                userId: newListing.userId,
                status: 'active'
            });

            // Reset the form
            resetForm();

            Alert.alert(
                "Success",
                "Your listing has been added successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.navigate('Home');
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error creating listing:', error);
            Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Failed to create listing. Please try again."
            );
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    

    return (
        <KeyboardAvoidingView
            style={stylesAddListingScreen.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={stylesAddListingScreen.headerContainer}>
                <TouchableOpacity 
                    style={stylesAddListingScreen.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" style={stylesAddListingScreen.backButtonIcon}/>
                </TouchableOpacity>
                <Text style={stylesAddListingScreen.headerTitle}>Add Listing</Text>
            </View>

            <ScrollView 
                style={stylesAddListingScreen.scrollContainer}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={stylesAddListingScreen.formContainer}>
                        <Formik<FormValues>
                            initialValues={{
                                listingType: 'lost' as ListingType,
                                title: '',
                                description: '',
                                date: '',
                                time: '',
                                location: '',
                                images: [],
                                category: '',
                            }}
                            validationSchema={listingValidationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue, resetForm }) => {
                                const pickImageAsync = async () => {
                                    if (values.images.length >= 5) {
                                        alert('Maximum 5 images allowed');
                                        return;
                                    }

                                    let result;
                                    if (values.listingType === 'found') {
                                        // For found items, show options to take photo or pick from gallery
                                        Alert.alert(
                                            "Add Image",
                                            "Choose an option",
                                            [
                                                {
                                                    text: "Take Photo",
                                                    onPress: async () => {
                                                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                                                        if (status !== 'granted') {
                                                            Alert.alert('Permission needed', 'Please grant camera permission to take photos');
                                                            return;
                                                        }
                                                        result = await ImagePicker.launchCameraAsync({
                                                            allowsEditing: true,
                                                            quality: 1,
                                                        });
                                                        if (!result.canceled) {
                                                            setFieldValue('images', [...values.images, result.assets[0].uri]);
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "Choose from Gallery",
                                                    onPress: async () => {
                                                        result = await ImagePicker.launchImageLibraryAsync({
                                                            allowsEditing: true,
                                                            quality: 1,
                                                        });
                                                        if (!result.canceled) {
                                                            setFieldValue('images', [...values.images, result.assets[0].uri]);
                                                        }
                                                    }
                                                },
                                                {
                                                    text: "Cancel",
                                                    style: "cancel"
                                                }
                                            ]
                                        );
                                    } else {
                                        // For lost items, only allow picking from gallery
                                        result = await ImagePicker.launchImageLibraryAsync({
                                            allowsEditing: true,
                                            quality: 1,
                                        });
                                        if (!result.canceled) {
                                            setFieldValue('images', [...values.images, result.assets[0].uri]);
                                        }
                                    }
                                };

                                const removeImage = (index: number) => {
                                    const newImages = [...values.images];
                                    newImages.splice(index, 1);
                                    setFieldValue('images', newImages);
                                };

                                return (
                                    <View style={stylesAddListingScreen.form}>
                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Type</Text>
                                            <View style={stylesAddListingScreen.typeToggleContainer}>
                                                <TouchableOpacity
                                                    style={[
                                                        stylesAddListingScreen.typeToggleButton,
                                                        values.listingType === 'lost' 
                                                            ? stylesAddListingScreen.typeToggleActive 
                                                            : stylesAddListingScreen.typeToggleInactive
                                                    ]}
                                                    onPress={() => setFieldValue('listingType', 'lost')}
                                                >
                                                    <Text style={[
                                                        stylesAddListingScreen.typeToggleText,
                                                        values.listingType === 'lost' 
                                                            ? stylesAddListingScreen.typeToggleTextActive 
                                                            : stylesAddListingScreen.typeToggleTextInactive
                                                    ]}>
                                                        Lost Item
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        stylesAddListingScreen.typeToggleButton,
                                                        values.listingType === 'found' 
                                                            ? stylesAddListingScreen.typeToggleActive 
                                                            : stylesAddListingScreen.typeToggleInactive
                                                    ]}
                                                    onPress={() => setFieldValue('listingType', 'found')}
                                                >
                                                    <Text style={[
                                                        stylesAddListingScreen.typeToggleText,
                                                        values.listingType === 'found' 
                                                            ? stylesAddListingScreen.typeToggleTextActive 
                                                            : stylesAddListingScreen.typeToggleTextInactive
                                                    ]}>
                                                        Found Item
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Name</Text>
                                            <TextInput
                                                style={stylesAddListingScreen.input}
                                                placeholder="Name"
                                                value={values.title}
                                                onChangeText={handleChange('title')}
                                                onBlur={handleBlur('title')}
                                            />
                                        </View>
                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Description</Text>
                                            <TextInput
                                                style={stylesAddListingScreen.input}
                                                placeholder="Description"
                                                value={values.description}
                                                onChangeText={handleChange('description')}
                                                onBlur={handleBlur('description')}
                                            />
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Category</Text>
                                            <TouchableOpacity
                                                style={[
                                                    stylesAddListingScreen.input,
                                                    !values.category && stylesAddListingScreen.requiredInput
                                                ]}
                                                onPress={() => {
                                                    setTempCategory(values.category);
                                                    setShowCategoryPicker(true);
                                                }}
                                            >
                                                <Text style={stylesAddListingScreen.inputText}>
                                                    {values.category || 'Select Category *'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showCategoryPicker && (
                                                <View style={stylesAddListingScreen.pickerContainer}>
                                                    <View style={stylesAddListingScreen.pickerHeader}>
                                                        <View style={stylesAddListingScreen.pickerButtonContainer}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setShowCategoryPicker(false);
                                                                }}
                                                                style={[stylesAddListingScreen.pickerButton, stylesAddListingScreen.cancelButton]}
                                                            >
                                                                <Text style={[stylesAddListingScreen.pickerButtonText, stylesAddListingScreen.cancelButtonText]}>Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setFieldValue('category', tempCategory);
                                                                    setShowCategoryPicker(false);
                                                                }}
                                                                style={stylesAddListingScreen.pickerButton}
                                                            >
                                                                <Text style={stylesAddListingScreen.pickerButtonText}>Done</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <Picker
                                                        selectedValue={tempCategory}
                                                        onValueChange={(itemValue) => {
                                                            setTempCategory(itemValue);
                                                        }}
                                                        style={stylesAddListingScreen.picker}
                                                    >
                                                        <Picker.Item label="Select a category" value="" />
                                                        {CATEGORIES.map((category) => (
                                                            <Picker.Item 
                                                                key={category} 
                                                                label={category} 
                                                                value={category} 
                                                            />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            )}
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <DatePickerComponent
                                                value={values.date}
                                                onChange={(date) => setFieldValue('date', date)}
                                                label={values.listingType === 'found' ? "Date Found" : "Date Lost"}
                                                required={true}
                                            />
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <TimePickerComponent
                                                value={values.time}
                                                onChange={(time) => setFieldValue('time', time)}
                                                label={values.listingType === 'found' ? "Time Found" : "Approximate Time Lost"}
                                                required={true}
                                            />
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>
                                                {values.listingType === 'found' ? "Location Found" : "Last Known Location"}
                                            </Text>
                                            {values.listingType === 'found' ? (
                                                <TouchableOpacity
                                                    style={[
                                                        stylesAddListingScreen.input,
                                                        !values.location && stylesAddListingScreen.requiredInput
                                                    ]}
                                                    onPress={async () => {
                                                        const location = await getCurrentLocation();
                                                        if (location) {
                                                            setFieldValue('location', location);
                                                        }
                                                    }}
                                                >
                                                    <Text style={stylesAddListingScreen.inputText}>
                                                        {values.location || 'Get Current Location *'}
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TextInput
                                                    style={[
                                                        stylesAddListingScreen.input,
                                                        !values.location && stylesAddListingScreen.requiredInput
                                                    ]}
                                                    placeholder="Enter location where you lost the item *"
                                                    value={values.location}
                                                    onChangeText={handleChange('location')}
                                                    onBlur={handleBlur('location')}
                                                />
                                            )}
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>
                                                Images ({values.images.length}/5)
                                            </Text>
                                            <TouchableOpacity
                                                style={stylesAddListingScreen.imageInput}
                                                onPress={pickImageAsync}
                                            >
                                                <Text style={stylesAddListingScreen.imageInputText}>
                                                    {values.images.length === 0 
                                                        ? (values.listingType === 'found' ? 'Take or select photos' : 'Select images')
                                                        : 'Add more images'}
                                                </Text>
                                            </TouchableOpacity>
                                            
                                            <ScrollView 
                                                horizontal 
                                                showsHorizontalScrollIndicator={false}
                                                style={stylesAddListingScreen.imageScrollView}
                                            >
                                                {values.images.map((image: string, index: number) => (
                                                    <ImagePreview 
                                                        key={index}
                                                        image={image} 
                                                        onDelete={() => removeImage(index)}
                                                    />
                                                ))}
                                            </ScrollView>
                                            
                                            {errors.images && (
                                                <Text style={stylesAddListingScreen.errorText}>{errors.images}</Text>
                                            )}
                                        </View>

                                        <TouchableOpacity
                                            style={stylesAddListingScreen.submitButton}
                                            onPress={() => handleSubmit()}
                                        >
                                            <Text style={stylesAddListingScreen.submitButtonText}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }}
                        </Formik>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AddListingScreen;