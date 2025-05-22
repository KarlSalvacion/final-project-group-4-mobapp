import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { stylesAddListingScreen } from '../styles/StylesAddListingScreen';

interface DatePickerComponentProps {
    value: string;
    onChange: (date: string) => void;
    label: string;
    required?: boolean;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
    value,
    onChange,
    label,
    required = false
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleOpenPicker = () => {
        const currentDate = value 
            ? new Date(value.replace(/(\d{4}) (\w+) (\d{1,2})/, '$1-$2-$3'))
            : new Date();
        setTempDate(currentDate);
        setShowPicker(true);
    };

    return (
        <View style={stylesAddListingScreen.formRow}>
            <Text style={stylesAddListingScreen.label}>{label}</Text>
            <TouchableOpacity
                style={[
                    stylesAddListingScreen.input,
                    !value && required && stylesAddListingScreen.requiredInput
                ]}
                onPress={handleOpenPicker}
            >
                <Text style={stylesAddListingScreen.inputText}>
                    {value || `Select ${label} *`}
                </Text>
            </TouchableOpacity>
            {showPicker && (
                <View style={stylesAddListingScreen.pickerContainer}>
                    <View style={stylesAddListingScreen.pickerHeader}>
                        <View style={stylesAddListingScreen.pickerButtonContainer}>
                            <TouchableOpacity
                                onPress={() => setShowPicker(false)}
                                style={[stylesAddListingScreen.pickerButton, stylesAddListingScreen.cancelButton]}
                            >
                                <Text style={[stylesAddListingScreen.pickerButtonText, stylesAddListingScreen.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    onChange(formatDate(tempDate));
                                    setShowPicker(false);
                                }}
                                style={stylesAddListingScreen.pickerButton}
                            >
                                <Text style={stylesAddListingScreen.pickerButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="spinner"
                        minimumDate={new Date(2024, 0, 1)}
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                setTempDate(selectedDate);
                            }
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default DatePickerComponent; 