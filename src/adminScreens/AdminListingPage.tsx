import React from 'react';
import { View, Image } from 'react-native';
import stylesAdminListingPage from '../styles/admin/StyleListingPage';

const AdminListingPage = () => {
    return (
        <View style={stylesAdminListingPage.mainContainer}>
            <View style={stylesAdminListingPage.headerContainer}>
                <View style={stylesAdminListingPage.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminListingPage.headerLogo}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

export default AdminListingPage;
