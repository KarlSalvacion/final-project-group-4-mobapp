import { BACKEND_BASE_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageFile {
    uri: string;
    type: string;
    name: string;
    size?: number;
}

export const listingService = {
    createListing: async (formData: FormData) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Creating listing with formData:', {
                title: formData.get('title'),
                description: formData.get('description'),
                type: formData.get('type'),
                category: formData.get('category'),
                location: formData.get('location'),
                date: formData.get('date'),
                time: formData.get('time'),
                imagesCount: formData.getAll('images').length
            });

            const images = formData.getAll('images');
            images.forEach((image, index) => {
                const imageFile = image as unknown as ImageFile;
                console.log(`Image ${index}:`, {
                    name: imageFile.name,
                    type: imageFile.type,
                    size: imageFile.size
                });
            });

            const response = await fetch(`${BACKEND_BASE_URL}/api/listings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorMessage = 'Failed to create listing';
                try {
                    const errorData = await response.json();
                    console.error('Error response (JSON):', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // If response is not JSON, try to get text
                    const errorText = await response.text();
                    console.error('Error response (Text):', errorText);
                    if (errorText) {
                        errorMessage = errorText;
                    }
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Success response:', data);
            return data;
        } catch (error) {
            console.error('Error in createListing:', error);
            if (error instanceof Error) {
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
            throw error;
        }
    },
}; 