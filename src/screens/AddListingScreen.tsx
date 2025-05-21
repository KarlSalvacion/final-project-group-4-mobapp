import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stylesAddListingScreen } from '../styles/StylesAddListingScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePreview from '../components/ImagePreview';
import { listingValidationSchema } from '../validation/ValidationSchema';
import { useListings } from '../context/ListingContext';
import { ListingType } from '../context/ListingContext';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import { useAuth } from '../context/AuthContext';
import { listingService } from '../services/listingService';

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
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

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

    const handleSubmit = async (values: FormValues) => {
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
            addListing(newListing);

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
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
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
                            onSubmit={(values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
                                // Validate all required fields before submission
                                if (!values.title || !values.description || !values.category || 
                                    !values.location || !values.date || !values.time || 
                                    values.images.length === 0) {
                                    Alert.alert(
                                        "Validation Error",
                                        "Please fill in all required fields and add at least one image."
                                    );
                                    return;
                                }
                                handleSubmit(values);
                                resetForm({
                                    values: {
                                        listingType: 'lost' as ListingType,
                                        title: '',
                                        description: '',
                                        date: '',
                                        time: '',
                                        location: '',
                                        images: [],
                                        category: '',
                                    }
                                });
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue, resetForm }) => {
                                const pickImageAsync = async () => {
                                    if (values.images.length >= 5) {
                                        alert('Maximum 5 images allowed');
                                        return;
                                    }

                                    let result = await ImagePicker.launchImageLibraryAsync({
                                        allowsEditing: true,
                                        quality: 1,
                                    });

                                    if (!result.canceled) {
                                        setFieldValue('images', [...values.images, result.assets[0].uri]);
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
                                                onPress={() => setShowCategoryPicker(true)}
                                            >
                                                <Text style={stylesAddListingScreen.inputText}>
                                                    {values.category || 'Select Category *'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showCategoryPicker && (
                                                <View style={stylesAddListingScreen.pickerContainer}>
                                                    <View style={stylesAddListingScreen.pickerHeader}>
                                                        <TouchableOpacity
                                                            onPress={() => setShowCategoryPicker(false)}
                                                            style={stylesAddListingScreen.pickerButton}
                                                        >
                                                            <Text style={stylesAddListingScreen.pickerButtonText}>Done</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Picker
                                                        selectedValue={values.category}
                                                        onValueChange={(itemValue) => {
                                                            setFieldValue('category', itemValue);
                                                            setShowCategoryPicker(false);
                                                        }}
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
                                            <Text style={stylesAddListingScreen.label}>Date</Text>
                                            <TouchableOpacity
                                                style={[
                                                    stylesAddListingScreen.input,
                                                    !values.date && stylesAddListingScreen.requiredInput
                                                ]}
                                                onPress={() => setShowDatePicker(true)}
                                            >
                                                <Text style={stylesAddListingScreen.inputText}>
                                                    {values.date || 'Select Date *'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showDatePicker && (
                                                <DateTimePicker
                                                    value={values.date ? new Date(values.date) : new Date()}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    minimumDate={new Date(2024, 0, 1)}
                                                    onChange={(event, selectedDate) => {
                                                        setShowDatePicker(false);
                                                        if (selectedDate && event.type !== 'dismissed') {
                                                            setFieldValue('date', formatDate(selectedDate));
                                                        }
                                                    }}
                                                />
                                            )}
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Time</Text>
                                            <TouchableOpacity
                                                style={[
                                                    stylesAddListingScreen.input,
                                                    !values.time && stylesAddListingScreen.requiredInput
                                                ]}
                                                onPress={() => setShowTimePicker(true)}
                                            >
                                                <Text style={stylesAddListingScreen.inputText}>
                                                    {values.time || 'Select Time *'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showTimePicker && (
                                                <DateTimePicker
                                                    value={values.time ? new Date(`1970-01-01T${values.time}`) : new Date()}
                                                    mode="time"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    onChange={(event, selectedDate) => {
                                                        setShowTimePicker(false);
                                                        if (selectedDate && event.type !== 'dismissed') {
                                                            setFieldValue('time', formatTime(selectedDate));
                                                        }
                                                    }}
                                                />
                                            )}
                                        </View>

                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Location</Text>
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
                                            <Text style={stylesAddListingScreen.label}>Images ({values.images.length}/5)</Text>
                                            <TouchableOpacity
                                                style={stylesAddListingScreen.imageInput}
                                                onPress={pickImageAsync}
                                            >
                                                <Text style={stylesAddListingScreen.imageInputText}>
                                                    {values.images.length === 0 ? 'Select images' : 'Add more images'}
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
                                            onPress={() => {
                                                if (Object.keys(errors).length === 0) {
                                                    handleSubmit();
                                                } else {
                                                    Alert.alert(
                                                        "Validation Error",
                                                        "Please fill in all required fields correctly."
                                                    );
                                                }
                                            }}
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