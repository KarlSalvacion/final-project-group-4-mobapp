import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { stylesImagePreview } from '../styles/components/StylesImagePreview';
import { Ionicons } from '@expo/vector-icons';

const ImagePreview = ({ image }: { image: string }) => {
    const [isPressed, setIsPressed] = useState(false);
    
    
    return (
        <View style={stylesImagePreview.imagePreviewContainer}>
            <Image 
                source={{ uri: image }} 
                style={stylesImagePreview.imagePreview} 
            />
            <TouchableOpacity 
                style={stylesImagePreview.deleteButton}
                onPress={() => setIsPressed(!isPressed)}
            >
                <Ionicons 
                    name="close" 
                    style={stylesImagePreview.deleteButtonIcon} />
            </TouchableOpacity>
        </View>


    );
};

export default ImagePreview;
