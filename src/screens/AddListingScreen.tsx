import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { stylesAddListingScreen } from '../styles/StylesAddListingScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import ImagePreview from '../components/ImagePreview';


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
    image: string;
};

const AddListingScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleSubmit = (values: FormValues) => {
        console.log("submitted");
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
                            image: '',
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Name is required'),
                            description: Yup.string().required('Description is required'),
                            date: Yup.string().required('Date is required'),
                            time: Yup.string().required('Time is required'),
                            location: Yup.string().required('Location is required'),
                            image: Yup.string().required('Image is required'),
                        })}
                        onSubmit={(values) => {
                            handleSubmit(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => {
                            const pickImageAsync = async () => {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                    allowsEditing: true,
                                    quality: 1,
                                });

                                if (!result.canceled) {
                                    setFieldValue('image', result.assets[0].uri);
                                }
                            };

                            return (
                                <View style={stylesAddListingScreen.form}>
                                    <View style={stylesAddListingScreen.formRow}>
                                        <Text style={stylesAddListingScreen.label}>Name</Text>
                                        <TextInput
                                            style={stylesAddListingScreen.input}
                                            placeholder="Name"
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                        />
                                    </View>
                                    <View style={stylesAddListingScreen.formRow}>
                                        <Text style={stylesAddListingScreen.label}>Description</Text>
                                        <TextInput
                                            style={stylesAddListingScreen.input}
                                            placeholder="Description"
                                            onChangeText={handleChange('description')}
                                            onBlur={handleBlur('description')}
                                        />
                                    </View>
                                    <View style={stylesAddListingScreen.formRow}>
                                        <Text style={stylesAddListingScreen.label}>Date</Text>
                                        <TextInput
                                            style={stylesAddListingScreen.input}
                                            placeholder="Date"
                                            onChangeText={handleChange('date')}
                                            onBlur={handleBlur('date')}
                                        />
                                    </View>
                                    <View style={stylesAddListingScreen.formRow}>
                                        <Text style={stylesAddListingScreen.label}>Time</Text>
                                        <TextInput
                                            style={stylesAddListingScreen.input}
                                            placeholder="Time"
                                            onChangeText={handleChange('time')}
                                            onBlur={handleBlur('time')}
                                        />
                                    </View>
                                    <View style={stylesAddListingScreen.formRow}>
                                        <Text style={stylesAddListingScreen.label}>Location</Text>
                                        <TextInput
                                            style={stylesAddListingScreen.input}
                                            placeholder="Location"
                                            onChangeText={handleChange('location')}
                                            onBlur={handleBlur('location')}
                                        />
                                    </View>
                                    <View style={stylesAddListingScreen.formRow}>
                                        <Text style={stylesAddListingScreen.label}>Image</Text>
                                        <TouchableOpacity
                                            style={stylesAddListingScreen.imageInput}
                                            onPress={pickImageAsync}
                                        >
                                            <Text style={stylesAddListingScreen.imageInputText}>{values.image ? 'Change image' : 'Select image'}</Text>
                                        </TouchableOpacity>
                                        
                                        {values.image && (
                                            <ImagePreview image={values.image} />
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
            </View>
        </View>
    );
}

export default AddListingScreen;
