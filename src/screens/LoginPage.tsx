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
} from 'react-native';
import { styles } from '../styles/components/StylesLoginPage';
import { useAuth } from '../context/AuthContext';

// List of admin email addresses
const ADMIN_EMAILS = [  // For testing purposes
  'admin@test.com',
];

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (field: 'email' | 'password') => (text: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: text,
    }));
  };

  const isAdminUser = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (!formData.email.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      // Determine user type before login
      const userType = isAdminUser(formData.email) ? 'admin' : 'user';
      console.log('Logging in as:', userType); // Debug log

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Login with determined user type
      login(formData.email, userType);
      console.log('Login successful as:', userType); // Debug log

    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Info', 'Forgot password functionality coming soon!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LOKÉ</Text>
        </View>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={handleInputChange('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={handleInputChange('password')}
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.forgotPassword} 
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
