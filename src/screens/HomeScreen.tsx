import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { stylesHomeScreen } from '../styles/StylesHomeScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
type RootStackParamList = {
    Home: undefined;
    AddListing: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    return (
        <View style={stylesHomeScreen.mainContainer}>
            <View style={stylesHomeScreen.headerContainer}>
                <Text style={stylesHomeScreen.headerTitle}>DLSL FoundIt</Text>

                <TouchableOpacity 
                    style={stylesHomeScreen.profileButton}
                    onPress={() => console.log('Profile')}
                    >
                    <Ionicons 
                        name="person" 
                        style={stylesHomeScreen.profileIcon}/>
                </TouchableOpacity>
            </View>
            <View style={stylesHomeScreen.contentContainer}>
                <Text>Homescreen</Text>
                <TouchableOpacity 
                    style={stylesHomeScreen.addListingButton}
                    onPress={() => navigation.navigate('AddListing')}
                    >
                    <Text style={stylesHomeScreen.addListingButtonText}>Add Listing</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

export default HomeScreen;
