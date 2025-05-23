import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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
import { ListingType } from '../types';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { listingService } from '../services/listingService';
import DatePickerComponent from '../components/DatePickerComponent';
import TimePickerComponent from '../components/TimePickerComponent';
import * as Location from 'expo-location';

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
    const { token, user } = useAuth();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [tempCategory, setTempCategory] = useState('');
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [tempTime, setTempTime] = useState<Date>(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const formRef = useRef<any>(null);

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
            setIsSubmitting(true);
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
            
            // Update the listings in context with the response from the server
            await addListing(newListing);

            // Show notification
            setShowNotification(true);

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
        } finally {
            setIsSubmitting(false);
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
    
    const handleReset = () => {
        Alert.alert(
            "Reset Form",
            "Are you sure you want to reset all fields?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Reset",
                    onPress: () => formRef.current?.resetForm(),
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            style={stylesAddListingScreen.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={stylesAddListingScreen.headerContainer}>
                <View style={stylesAddListingScreen.headerContent}>
                    <TouchableOpacity 
                        style={stylesAddListingScreen.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" style={stylesAddListingScreen.backButtonIcon}/>
                    </TouchableOpacity>
                    <Text style={stylesAddListingScreen.headerTitle}>Add Listing</Text>
                </View>
                <TouchableOpacity
                    style={stylesAddListingScreen.resetButton}
                    onPress={handleReset}
                >
                    <Text style={stylesAddListingScreen.resetButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={stylesAddListingScreen.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={stylesAddListingScreen.formContainer}>
                        <Formik<FormValues>
                            innerRef={formRef}
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
                                const getCurrentLocation = async () => {
                                    try {
                                        setIsGettingLocation(true);
                                        const { status } = await Location.requestForegroundPermissionsAsync();
                                        if (status !== 'granted') {
                                            Alert.alert(
                                                'Permission Denied',
                                                'Please enable location services to use this feature.'
                                            );
                                            return;
                                        }

                                        const location = await Location.getCurrentPositionAsync({});
                                        const [address] = await Location.reverseGeocodeAsync({
                                            latitude: location.coords.latitude,
                                            longitude: location.coords.longitude
                                        });

                                        if (address) {
                                            const locationString = [
                                                address.street,
                                                address.city,
                                                address.region,
                                                address.postalCode
                                            ].filter(Boolean).join(', ');
                                            setFieldValue('location', locationString);
                                        }
                                    } catch (error) {
                                        Alert.alert(
                                            'Error',
                                            'Failed to get your current location. Please try again or enter the location manually.'
                                        );
                                    } finally {
                                        setIsGettingLocation(false);
                                    }
                                };

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
                                                            quality: 0.5,
                                                            exif: false,
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
                                                            quality: 0.5,
                                                            exif: false,
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
                                            quality: 0.5,
                                            exif: false,
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
                                            <View style={{ width: '100%', position: 'relative' }}>
                                                <TextInput
                                                    style={stylesAddListingScreen.input}
                                                    placeholder="Name"
                                                    placeholderTextColor={"#999"}
                                                    value={values.title}
                                                    onChangeText={handleChange('title')}
                                                    onBlur={handleBlur('title')}
                                                    selectionColor="rgb(25, 153, 100)"
                                                />
                                                {values.title.length > 0 && (
                                                    <TouchableOpacity
                                                        style={{ position: 'absolute', right: 10, top: 8 }}
                                                        onPress={() => setFieldValue('title', '')}
                                                    >
                                                        <Ionicons name="close-circle" size={20} color="#aaa" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Description</Text>
                                            <View style={{ width: '100%', position: 'relative' }}>
                                                <TextInput
                                                    style={[stylesAddListingScreen.input, stylesAddListingScreen.descriptionInput]}
                                                    multiline={true}
                                                    numberOfLines={6}
                                                    placeholder="Description"
                                                    placeholderTextColor={"#999"}
                                                    value={values.description}
                                                    onChangeText={handleChange('description')}
                                                    onBlur={handleBlur('description')}
                                                    selectionColor="rgb(25, 153, 100)"
                                                />
                                                {values.description.length > 0 && (
                                                    <TouchableOpacity
                                                        style={{ position: 'absolute', right: 10, top: 8 }}
                                                        onPress={() => setFieldValue('description', '')}
                                                    >
                                                        <Ionicons name="close-circle" size={20} color="#aaa" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
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
                                            <View style={{ width: '100%', position: 'relative' }}>
                                                <TextInput
                                                    style={[
                                                        stylesAddListingScreen.locationInput,
                                                        !values.location && stylesAddListingScreen.requiredInput
                                                    ]}
                                                    placeholder={values.listingType === 'found' ? 
                                                        "Enter location where you found the item *" : 
                                                        "Enter location where you lost the item *"}
                                                    value={values.location}
                                                    multiline={true}
                                                    numberOfLines={3}
                                                    onChangeText={handleChange('location')}
                                                    onBlur={handleBlur('location')}
                                                    selectionColor="rgb(25, 153, 100)"
                                                />
                                                {values.listingType === 'found' && (
                                                    <TouchableOpacity
                                                        style={stylesAddListingScreen.locationButton}
                                                        onPress={getCurrentLocation}
                                                        disabled={isGettingLocation}
                                                    >
                                                        {isGettingLocation ? (
                                                            <ActivityIndicator size="small" color="#fff" />
                                                        ) : (
                                                            <Ionicons name="location" size={20} color="#fff" />
                                                        )}
                                                    </TouchableOpacity>
                                                )}
                                                {values.location.length > 0 && (
                                                    <TouchableOpacity
                                                        style={{ position: 'absolute', right: 10, top: 8 }}
                                                        onPress={() => setFieldValue('location', '')}
                                                    >
                                                        <Ionicons name="close-circle" size={20} color="#aaa" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
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
                                            style={[
                                                stylesAddListingScreen.submitButton,
                                                isSubmitting && stylesAddListingScreen.submitButtonDisabled
                                            ]}
                                            onPress={() => handleSubmit()}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <View style={stylesAddListingScreen.submitButtonContent}>
                                                    <ActivityIndicator size="small" color="#fff" />
                                                    <Text style={stylesAddListingScreen.submitButtonText}>Processing...</Text>
                                                </View>
                                            ) : (
                                                <Text style={stylesAddListingScreen.submitButtonText}>Submit</Text>
                                            )}
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