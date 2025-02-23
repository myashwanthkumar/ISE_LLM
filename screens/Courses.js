import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CourseDetails = ({ courseCode, courseName, instructor, credits, description, department }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.rectangle}>
                        <Text style={styles.text}>Course Code: {courseCode}</Text>
                        <Text style={styles.text}>Course Name: {courseName}</Text>
                        <Text style={styles.text}>Instructor: {instructor}</Text>
                        <Text style={styles.text}>Credits: {credits}</Text>
                        <Text style={styles.text}>Description: {description}</Text>
                        <Text style={styles.text}>Department: {department}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    rectangle: {
        backgroundColor: '#ff9',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        opacity: 0.8,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5,
    },
});

export default CourseDetails;
