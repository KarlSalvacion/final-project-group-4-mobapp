import React, { useRef, useState } from 'react';
import { View, Image, Dimensions, StyleSheet, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface ImageCarouselProps {
    images: string[];
}

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const renderImage = ({ item }: { item: string }) => (
        <View style={styles.carouselItem}>
            <Image 
                source={{ uri: item }}
                style={styles.carouselImage}
                resizeMode="cover"
            />
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveSlide(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    // If there's only one image, render it without carousel functionality
    if (images.length === 1) {
        return (
            <View style={styles.container}>
                <Image 
                    source={{ uri: images[0] }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.countIndicator}>
                <Text style={styles.countText}>
                    {activeSlide + 1}/{images.length}
                </Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderImage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.paginationContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeSlide && styles.paginationDotActive
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    carouselItem: {
        width: screenWidth,
        height: 300,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        width: '100%',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    countIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        zIndex: 1,
    },
    countText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ImageCarousel; 