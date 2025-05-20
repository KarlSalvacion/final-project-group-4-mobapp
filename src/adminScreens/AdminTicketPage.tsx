import React from 'react';
import { View, Image } from 'react-native';
import stylesAdminTicketPage from '../styles/admin/StyleTicketPage';

const AdminTicketPage = () => {
    return (
        <View style={stylesAdminTicketPage.mainContainer}>
            <View style={stylesAdminTicketPage.headerContainer}>
                <View style={stylesAdminTicketPage.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesAdminTicketPage.headerLogo}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
};

export default AdminTicketPage;
