import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stylesAddListingScreen } from '../styles/StylesAddListingScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import ImagePreview from '../components/ImagePreview';
import { validationSchema } from '../validation/ValidationSchema';
import { useListings } from '../context/ListingContext';


type RootStackParamList = {
    Home: undefined;
    AddListing: undefined;
};

type FormValues = {
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

    const handleSubmit = (values: FormValues) => {
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
                <View style={stylesAddListingScreen.formContainer}>
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            date: '',
                            time: '',
                            location: '',
                            images: [],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmit(values);
                            resetForm({
                                values: {
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
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                    <View style={stylesAddListingScreen.form}>
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
                                            <TextInput
                                                style={stylesAddListingScreen.input}
                                                placeholder="Date"
                                                value={values.date}
                                                onChangeText={handleChange('date')}
                                                onBlur={handleBlur('date')}
                                            />
                                        </View>
                                        <View style={stylesAddListingScreen.formRow}>
                                            <Text style={stylesAddListingScreen.label}>Time</Text>
                                            <TextInput
                                                style={stylesAddListingScreen.input}
                                                placeholder="Time"
                                                value={values.time}
                                                onChangeText={handleChange('time')}
                                                onBlur={handleBlur('time')}
                                            />
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
                                                {values.images.map((image, index) => (
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
                            );
                        }}
                    </Formik>
                </View>
            </View>
        </View>
    );
}

export default AddListingScreen;
