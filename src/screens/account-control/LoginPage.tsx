import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { styles } from '../../styles/components/StylesLoginPage';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import { loginValidationSchema } from '../../validation/ValidationSchema';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

// List of admin email addresses
const ADMIN_EMAILS = [  // For testing purposes
  'admin@test.com',
];

type FormValues = {
    email: string;
    password: string;
};

const LoginPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const isAdminUser = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  const handleLogin = async (values: FormValues) => {
    try {
      setIsLoading(true);

      // Make API call to backend
      const response = await fetch('http://192.168.1.6:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const userData = await response.json();
      
      // Determine user type
      const userType = isAdminUser(values.email) ? 'admin' : 'user';
      console.log('Logging in as:', userType); // Debug log

      // Login with user data and type
      await login(values.email, userType, userData);
      console.log('Login successful as:', userType); // Debug log

    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>LOKÉ</Text>
          </View>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
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
              <>
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        touched.email && errors.email && styles.inputError
                      ]}
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!isLoading}
                    />
                    {values.email ? (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                          setFieldValue('email', '');
                        }}
                      >
                        <Ionicons name="close-circle" size={20} color="#666" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        touched.password && errors.password && styles.inputError
                      ]}
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!isLoading && values.email.length > 0}
                    />
                    <View style={styles.inputIcons}>
                      {values.password ? (
                        <TouchableOpacity
                          style={styles.passwordToggle}
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
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={[
                    styles.loginButton,
                    isLoading && { opacity: 0.7 },
                    (!values.email || !values.password) && styles.disabledButton
                  ]} 
                  onPress={() => handleSubmit()}
                  disabled={isLoading || !values.email || !values.password}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <TouchableOpacity 
            style={styles.createAccountButton} 
            onPress={() => navigation.navigate('SignUp')}
            disabled={isLoading}
          >
            <Text style={styles.createAccountText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
