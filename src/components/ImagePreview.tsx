import React from 'react';
import { Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { stylesImagePreview } from '../styles/components/StylesImagePreview';
import { Ionicons } from '@expo/vector-icons';

interface ImagePreviewProps {
    image: string;
    onDelete: () => void;
}

const ImagePreview = ({ image, onDelete }: ImagePreviewProps) => {
    return (
        <ScrollView 
            style={stylesImagePreview.imagePreviewScrollViewContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            <View style={stylesImagePreview.imagePreviewContainer}>
                <Image 
                    source={{ uri: image }} 
                    style={stylesImagePreview.imagePreview} 
                />
                <TouchableOpacity 
                    style={stylesImagePreview.deleteButton}
                    onPress={onDelete}
                >
                    <Ionicons 
                        name="close" 
                        style={stylesImagePreview.deleteButtonIcon} 
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ImagePreview;
