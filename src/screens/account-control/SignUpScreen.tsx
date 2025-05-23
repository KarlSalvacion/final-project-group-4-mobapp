import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { Formik } from 'formik';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signUpValidationSchema } from '../../validation/ValidationSchema';
import { stylesSignUpScreen } from '../../styles/components/StylesSignUpScreen';
import { BACKEND_BASE_URL } from '../../config/apiConfig';


type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

type FormValues = {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const SignUpScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Simple GET request for network debugging
    useEffect(() => {
        fetch(`${BACKEND_BASE_URL}/api/users/register`, { method: 'GET' })
            .then(res => res.text())
            .then(text => console.log('GET /api/users/register response:', text))
            .catch(err => console.log('GET /api/users/register error:', err));
    }, []);

    const handleSignUp = async (values: FormValues) => {
        try {
            setIsLoading(true);
            const userId = uuidv4();
            
            const response = await fetch(`${BACKEND_BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sign up failed');
            }

            Alert.alert(
                'Success',
                'Account created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={stylesSignUpScreen.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={stylesSignUpScreen.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={stylesSignUpScreen.headerContainer}>
                        <Text style={stylesSignUpScreen.headerTitle}>Create Account</Text>
                    </View>

                    <View style={stylesSignUpScreen.formContainer}>
                        <Formik
                            initialValues={{
                                name: '',
                                username: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={signUpValidationSchema}
                            onSubmit={handleSignUp}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                                setFieldValue,
                            }) => (
                                <View style={stylesSignUpScreen.form}>
                                    <View style={stylesSignUpScreen.inputContainer}>
                                        <Text style={stylesSignUpScreen.label}>Full Name</Text>
                                        <View style={stylesSignUpScreen.inputWrapper}>
                                            <TextInput
                                                style={[
                                                    stylesSignUpScreen.input,
                                                    touched.name && errors.name && stylesSignUpScreen.inputError,
                                                ]}
                                                placeholder="Enter your full name"
                                                value={values.name}
                                                onChangeText={(text) => {
                                                    const cleanedText = text.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ');
                                                    handleChange('name')(cleanedText);
                                                }}
                                                onBlur={handleBlur('name')}
                                                autoCapitalize="words"
                                            />
                                            {values.name ? (
                                                <TouchableOpacity
                                                    style={stylesSignUpScreen.clearButton}
                                                    onPress={() => {
                                                        setFieldValue('name', '');
                                                    }}
                                                >
                                                    <Ionicons name="close-circle" size={20} color="#666" />
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                        {touched.name && errors.name && (
                                            <Text style={stylesSignUpScreen.errorText}>{errors.name}</Text>
                                        )}
                                    </View>

                                    <View style={stylesSignUpScreen.inputContainer}>
                                        <Text style={stylesSignUpScreen.label}>Username</Text>
                                        <View style={stylesSignUpScreen.inputWrapper}>
                                            <TextInput
                                                style={[
                                                    stylesSignUpScreen.input,
                                                    touched.username && errors.username && stylesSignUpScreen.inputError,
                                                ]}
                                                placeholder="Enter username (letters, numbers, . or _)"
                                                value={values.username}
                                                onChangeText={(text) => {
                                                    const cleanedText = text.replace(/[^A-Za-z0-9._]/g, '');
                                                    handleChange('username')(cleanedText);
                                                }}
                                                onBlur={handleBlur('username')}
                                                autoCapitalize="none"
                                                editable={values.name?.length > 0}
                                            />
                                            {values.username ? (
                                                <TouchableOpacity
                                                    style={stylesSignUpScreen.clearButton}
                                                    onPress={() => {
                                                        setFieldValue('username', '');
                                                        setFieldValue('email', '');
                                                        setFieldValue('password', '');
                                                        setFieldValue('confirmPassword', '');
                                                    }}
                                                >
                                                    <Ionicons name="close-circle" size={20} color="#666" />
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                        {touched.username && errors.username && (
                                            <Text style={stylesSignUpScreen.errorText}>{errors.username}</Text>
                                        )}
                                    </View>

                                    <View style={stylesSignUpScreen.inputContainer}>
                                        <Text style={stylesSignUpScreen.label}>Email</Text>
                                        <View style={stylesSignUpScreen.inputWrapper}>
                                            <TextInput
                                                style={[
                                                    stylesSignUpScreen.input,
                                                    touched.email && errors.email && stylesSignUpScreen.inputError,
                                                ]}
                                                placeholder="Enter email (@dlsl.edu.ph)"
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                editable={values.username?.length > 0}
                                            />
                                            {values.email ? (
                                                <TouchableOpacity
                                                    style={stylesSignUpScreen.clearButton}
                                                    onPress={() => {
                                                        setFieldValue('email', '');
                                                    }}
                                                >
                                                    <Ionicons name="close-circle" size={20} color="#666" />
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                        {touched.email && errors.email && (
                                            <Text style={stylesSignUpScreen.errorText}>{errors.email}</Text>
                                        )}
                                    </View>

                                    <View style={stylesSignUpScreen.inputContainer}>
                                        <Text style={stylesSignUpScreen.label}>Password</Text>
                                        <View style={stylesSignUpScreen.inputWrapper}>
                                            <TextInput
                                                style={[
                                                    stylesSignUpScreen.input,
                                                    touched.password && errors.password && stylesSignUpScreen.inputError,
                                                ]}
                                                placeholder="Enter password"
                                                value={values.password}
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={!showPassword}
                                                editable={values.email?.length > 0}
                                            />
                                            <View style={stylesSignUpScreen.inputIcons}>
                                                {values.password ? (
                                                    <TouchableOpacity
                                                        style={stylesSignUpScreen.passwordToggle}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                    >
                                                        <Ionicons
                                                            name={showPassword ? "eye-off" : "eye"}
                                                            size={20}
                                                            color="#666"
                                                        />
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                        </View>
                                        {touched.password && errors.password && (
                                            <Text style={stylesSignUpScreen.errorText}>{errors.password}</Text>
                                        )}
                                    </View>

                                    <View style={stylesSignUpScreen.inputContainer}>
                                        <Text style={stylesSignUpScreen.label}>Confirm Password</Text>
                                        <View style={stylesSignUpScreen.inputWrapper}>
                                            <TextInput
                                                style={[
                                                    stylesSignUpScreen.input,
                                                    touched.confirmPassword && errors.confirmPassword && stylesSignUpScreen.inputError,
                                                ]}
                                                placeholder="Confirm password"
                                                value={values.confirmPassword}
                                                onChangeText={handleChange('confirmPassword')}
                                                onBlur={handleBlur('confirmPassword')}
                                                secureTextEntry={!showConfirmPassword}
                                                editable={values.password?.length > 0}
                                            />
                                            <View style={stylesSignUpScreen.inputIcons}>
                                                {values.confirmPassword ? (
                                                    <TouchableOpacity
                                                        style={stylesSignUpScreen.passwordToggle}
                                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        <Ionicons
                                                            name={showConfirmPassword ? "eye-off" : "eye"}
                                                            size={20}
                                                            color="#666"
                                                        />
                                                    </TouchableOpacity>
                                                ) : null}
                                            </View>
                                        </View>
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <Text style={stylesSignUpScreen.errorText}>{errors.confirmPassword}</Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            stylesSignUpScreen.submitButton,
                                            (!values.name?.length || !values.username?.length || !values.email?.length || !values.password?.length || !values.confirmPassword?.length) && stylesSignUpScreen.disabledButton
                                        ]}
                                        onPress={() => handleSubmit()}
                                        disabled={isLoading || !values.name?.length || !values.username?.length || !values.email?.length || !values.password?.length || !values.confirmPassword?.length}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={stylesSignUpScreen.submitButtonText}>Sign Up</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={stylesSignUpScreen.loginLink}
                                        onPress={() => navigation.navigate('Login')}
                                    >
                                        <Text style={stylesSignUpScreen.loginLinkText}>
                                            Already have an account? Login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;
