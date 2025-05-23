import { StyleSheet, Platform } from 'react-native';

export const stylesNavigationBar = StyleSheet.create({
    tabBarContainer: {
        height: Platform.OS === 'android' ? 90 : 60,
        backgroundColor: 'rgb(25, 153, 100)',
        paddingBottom: Platform.OS === 'android' ? 30 : 0,
        borderTopWidth: 0,
        elevation: 0,
    },
});


