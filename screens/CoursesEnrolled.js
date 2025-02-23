import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CardDetails from '../components/CardDetails';
import { GLOBAL_CONFIG } from '../components/global_config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const CoursesEnrolled = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const fetchClasses = useCallback(async () => {
        try {
            const userId = await AsyncStorage.getItem('uname');
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/createClass/user`, { userId });
            setClasses(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(fetchClasses);

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Loading classes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error loading classes: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {classes.length > 0 ? (
                    classes.map(classItem => (
                        <CardDetails
                            key={classItem._id}
                            course={classItem.className}
                            subject={classItem.subjectName}
                            instructor={classItem.instructorName}
                            id={classItem._id}
                            fetchClasses={fetchClasses}
                            navigation={navigation}
                        />
                    ))
                ) : (
                    <View style={styles.noCoursesContainer}>
                        <Text style={styles.noCoursesText}>No Courses Enrolled</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.activeButton]}
                    onPress={() => navigation.navigate('CoursesEnrolled')}
                >
                    <Ionicons name="book" size={22} color="white" />
                    <Text style={styles.buttonText}>Courses Enrolled</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CoursesAvailable')}
                >
                    <Ionicons name="reader-outline" size={22} color="white" />
                    <Text style={styles.buttonText}>Courses Available</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CoursesEnrolled;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noCoursesContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noCoursesText: { fontSize: 18, color: '#6C757D', textAlign: 'center' },
    fixedButtonContainer: {
        flexDirection: 'row',
        backgroundColor: '#D4BEE4',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    button: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    activeButton: { backgroundColor: '#3C0A6B' },
    buttonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 3 },
});
