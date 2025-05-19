import React from 'react';
import { View, Text } from 'react-native';
import stylesAdminListingPage from '../src/styles/admin/StyleListingPage';

const AdminListingPage = () => {
    return (
        <View style={stylesAdminListingPage.mainContainer}>
            <View style={stylesAdminListingPage.headerContainer}>
                <Text>DLSL FoundIt</Text>
            </View>
        </View>
    );
};

export default AdminListingPage;
