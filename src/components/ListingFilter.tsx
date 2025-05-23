import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type FilterType = 'all' | 'found' | 'lost';

interface ListingFilterProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

const ListingFilter = ({ activeFilter, onFilterChange }: ListingFilterProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.filterButton,
                    activeFilter === 'all' && styles.activeFilter
                ]}
                onPress={() => onFilterChange('all')}
            >
                <Ionicons 
                    name="list" 
                    size={20} 
                    color={activeFilter === 'all' ? '#fff' : 'rgb(25, 153, 100)'} 
                />
                <Text style={[
                    styles.filterText,
                    activeFilter === 'all' && styles.activeFilterText
                ]}>
                    All
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.filterButton,
                    activeFilter === 'found' && styles.activeFilter
                ]}
                onPress={() => onFilterChange('found')}
            >
                <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={activeFilter === 'found' ? '#fff' : 'rgb(25, 153, 100)'} 
                />
                <Text style={[
                    styles.filterText,
                    activeFilter === 'found' && styles.activeFilterText
                ]}>
                    Found
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.filterButton,
                    activeFilter === 'lost' && styles.activeFilter
                ]}
                onPress={() => onFilterChange('lost')}
            >
                <Ionicons 
                    name="search" 
                    size={20} 
                    color={activeFilter === 'lost' ? '#fff' : 'rgb(25, 153, 100)'} 
                />
                <Text style={[
                    styles.filterText,
                    activeFilter === 'lost' && styles.activeFilterText
                ]}>
                    Lost
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(25, 153, 100, 0.1)',
        gap: 6,
    },
    activeFilter: {
        backgroundColor: 'rgb(25, 153, 100)',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgb(25, 153, 100)',
    },
    activeFilterText: {
        color: '#fff',
    },
});

export default ListingFilter; 