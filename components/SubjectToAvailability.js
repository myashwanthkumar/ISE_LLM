import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, TextInput } from 'react-native';
import { GLOBAL_CONFIG } from './global_config';

export default function SubjectToAvailability({ Name, setName, fieldName, placeholder = fieldName, Color }) {
    const [status, setStatus] = useState("");
    const [available, setAvailable] = useState(false);

    const availability = async (inputName) => {
        try {
            setAvailable(false); // Reset availability before checking

            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/check`, { Name: inputName, fieldName });

            if (response.data.available) {
                setAvailable(true);
                setStatus("");
            } else {
                setStatus(`${fieldName} already exists`);
                setAvailable(false);
            }
        } catch (error) {
            console.error('Error checking username availability:', error.message);
        }
    };

    const checkName = (text) => {
        setName(text);
        setAvailable(false);

        if (text !== "") {
            availability(text);
        } else {
            setStatus("");
        }
    };

    return (
        <View style={[styles.inputContainer, { borderColor: Color ? 'white' : 'red' }]}>
            <TextInput
                style={[styles.input, { borderColor: Color ? 'white' : 'red' }]}
                placeholder={placeholder}
                value={Name}
                onChangeText={checkName}
            />
            {status !== '' && <Text style={[styles.text, { color: available ? "green" : "red" }]}>{status}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "90%",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        fontSize: 10,
        backgroundColor: "white",
        opacity: 0.6,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
        paddingHorizontal: 10,
        width: '99%',
        backgroundColor: 'white',
        opacity: 0.6,
    },
});
