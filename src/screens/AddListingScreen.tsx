import React, { useState } from 'react';
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
import { validationSchema } from '../validation/ValidationSchema';
import { useListings } from '../context/ListingContext';
import { ListingType } from '../context/ListingContext';

type RootStackParamList = {
    Home: undefined;
    AddListing: undefined;
};

type FormValues = {
    listingType: ListingType;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    images: string[];
};

const AddListingScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { addListing } = useListings();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleSubmit = (values: FormValues) => {
        if (!values.date || !values.time) {
            Alert.alert(
                "Validation Error",
                "Please select both date and time before submitting."
            );
            return;
        }
        addListing(values);
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
        <View style={stylesAddListingScreen.mainContainer}>
            <View style={stylesAddListingScreen.headerContainer}>
                <TouchableOpacity 
                    style={stylesAddListingScreen.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" style={stylesAddListingScreen.backButtonIcon}/>
                </TouchableOpacity>
                <Text style={stylesAddListingScreen.headerTitle}>Add Listing</Text>
            </View>

            <View style={stylesAddListingScreen.contentContainer}>
                <ScrollView 
                    style={stylesAddListingScreen.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 20}}
                >
                    <View style={stylesAddListingScreen.formContainer}>
                        <Formik<FormValues>
                            initialValues={{
                                listingType: 'lost' as ListingType,
                                name: '',
                                description: '',
                                date: '',
                                time: '',
                                location: '',
                                images: [],
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
                                handleSubmit(values);
                                resetForm({
                                    values: {
                                        listingType: 'lost' as ListingType,
                                        name: '',
                                        description: '',
                                        date: '',
                                        time: '',
                                        location: '',
                                        images: [],
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
                                    <KeyboardAvoidingView
                                        style={stylesAddListingScreen.mainContainer}
                                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                        keyboardVerticalOffset={Platform.OS === 'ios'? 80 : 0}
                                    >
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                                        value={values.name}
                                                        onChangeText={handleChange('name')}
                                                        onBlur={handleBlur('name')}
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
                                                    <TextInput
                                                        style={stylesAddListingScreen.input}
                                                        placeholder="Location"
                                                        value={values.location}
                                                        onChangeText={handleChange('location')}
                                                        onBlur={handleBlur('location')}
                                                    />
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
                                        </TouchableWithoutFeedback>
                                    </KeyboardAvoidingView>
                                );
                            }}
                        </Formik>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default AddListingScreen;
