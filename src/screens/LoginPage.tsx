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

      // TODO: Replace with actual API call to your backend
      // This is a mock response simulating your MongoDB data
      const mockUserData = {
        _id: "mock-user-id",
        username: "user1",
        email: formData.email,
        name: "User One",
        profilePhoto: undefined,
        role: formData.email === "user1@example.com" ? "admin" as const : "user" as const,
        createdAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Login with user data
      const mockToken = 'mock-jwt-token';
      login(formData.email, mockUserData, mockToken);
      console.log('Login successful as:', mockUserData.role);

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
          <Image 
            source={require('../assets/login-logo.png')}
            style={styles.loginLogo}
            resizeMode="contain"
          />
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
          style={styles.createAccountButton} 
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.createAccountText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
