import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBAL_CONFIG } from '../../components/global_config';

export default function MainWindow({ navigation, route }) {
    const { course } = route.params;
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('uname');
                if (storedUserId) setUserId(storedUserId.toLowerCase());
                else Alert.alert("Error", "User ID not found!");
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
        fetchUserId();
    }, []);

    const fetchAdminStatus = async () => {
        if (!userId) {
            Alert.alert("Error", "User ID not found!");
            return null;
        }

        try {
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/Admin`, {
                course,
                user: userId,
            });
            return response.data.admin;
        } catch (error) {
            console.error("Error fetching admin status:", error);
            Alert.alert("Error", "Unable to fetch attendance data.");
            return null;
        }
    };

    const handleNavigation = async (screen, adminScreen, studentScreen) => {
        const isAdmin = await fetchAdminStatus();
        if (isAdmin === null) return;
        navigation.navigate(isAdmin ? adminScreen : studentScreen, { course });
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Attendance', 'Dates', 'UserDates')}>
                    <Text style={styles.buttonText}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Progress', 'AdminMarks', 'StudentMarks')}>
                    <Text style={styles.buttonText}>Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Quiz', 'QuizList', 'QuizList')}>
                    <Text style={styles.buttonText}>Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleNavigation('NoticeBoard', 'NoticeBoard', 'NoticeBoard')}>
                    <Text style={styles.buttonText}>Discussion Board</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Participants', { courseId: course })}>
                    <Text style={styles.buttonText}>Participants</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F6F4' },
    buttonContainer: { flex: 1, paddingTop: 30 },
    button: {
        padding: 25,
        margin: 15,
        borderRadius: 8,
        backgroundColor: '#3C0A6B',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 21,
    },
});
