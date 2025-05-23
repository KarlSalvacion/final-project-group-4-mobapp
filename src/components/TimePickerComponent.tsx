import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { stylesAddListingScreen } from '../styles/StylesAddListingScreen';

interface TimePickerComponentProps {
    value: string;
    onChange: (time: string) => void;
    label: string;
    required?: boolean;
}

const TimePickerComponent: React.FC<TimePickerComponentProps> = ({
    value,
    onChange,
    label,
    required = false
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [tempTime, setTempTime] = useState<Date>(new Date());

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleOpenPicker = () => {
        let currentTime;
        if (value) {
            // Parse the time string with AM/PM
            const [time, period] = value.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            currentTime = new Date();
            // Convert to 24-hour format
            const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : 
                          period === 'AM' && hours === 12 ? 0 : hours;
            currentTime.setHours(hour24);
            currentTime.setMinutes(minutes);
        } else {
            currentTime = new Date();
        }
        setTempTime(currentTime);
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
                                    onChange(formatTime(tempTime));
                                    setShowPicker(false);
                                }}
                                style={stylesAddListingScreen.pickerButton}
                            >
                                <Text style={stylesAddListingScreen.pickerButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DateTimePicker
                    value={tempTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        if (event.type !== 'dismissed' && selectedDate) {
                        setTempTime(selectedDate);
                        }
                    }}
                    />

                </View>
            )}
        </View>
    );
};

export default TimePickerComponent; 