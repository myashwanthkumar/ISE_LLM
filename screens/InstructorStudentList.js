import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { GLOBAL_CONFIG } from '../components/global_config';

const InstructorStudentList = ({ route }) => {
    const { courseId } = route.params;
    const [students, setStudents] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [adminResponse, studentResponse] = await Promise.all([
                    axios.get(`https://${GLOBAL_CONFIG.SYSTEM_IP}/details/${courseId}/admins`),
                    axios.get(`https://${GLOBAL_CONFIG.SYSTEM_IP}/details/${courseId}/students`)
                ]);
                setAdmins(adminResponse.data.admins || []);
                setStudents(studentResponse.data.students || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [courseId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#3C0A6B" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.header}>Teacher</Text>
                {admins.length > 0 ? (
                    <FlatList
                        data={admins}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={[styles.userItem, styles.adminItem]}>
                                <Text style={styles.boldText}>{item.name} (Username: {item.uname})</Text>
                                <Text style={styles.subText}>Email: {item.email}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noData}>No instructors assigned.</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Students Enrolled</Text>
                {students.length > 0 ? (
                    <FlatList
                        data={students}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.userItem}>
                                <Text style={styles.boldText}>{item.name} (Username: {item.uname})</Text>
                                <Text style={styles.subText}>Email: {item.email}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noData}>No students enrolled.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6F4',
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#3C0A6B',
    },
    userItem: {
        padding: 10,
        backgroundColor: '#D4BEE4',
        marginBottom: 5,
        borderRadius: 8,
    },
    adminItem: {
        backgroundColor: '#D0E8FF',
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subText: {
        fontSize: 14,
        color: 'purple',
        paddingTop: 5,
    },
    noData: {
        fontSize: 16,
        fontStyle: 'italic',
        color: 'gray',
        textAlign: 'center',
        marginVertical: 10,
    },
    loader: {
        marginTop: 50,
    },
});

export default InstructorStudentList;
