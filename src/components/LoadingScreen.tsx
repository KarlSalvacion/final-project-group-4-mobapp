import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { stylesGlobal } from '../styles/StylesGlobal';

const LoadingScreen = () => {
    return (
        <View style={[stylesGlobal.mainContainer, styles.container]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingScreen; 