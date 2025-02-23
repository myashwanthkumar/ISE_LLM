import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, View, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { GLOBAL_CONFIG } from './global_config';
import { PaperProvider, Card, Button, Title, Paragraph } from 'react-native-paper';

const CardDetails = ({ subject, course, instructor, fetchClasses, navigation }) => {
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const findAdmin = async () => {
            try {
                const userId = (await AsyncStorage.getItem('uname'))?.toLowerCase();
                if (!userId) return;

                const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/Admin`, {
                    course,
                    user: userId,
                });

                setAdmin(response.data.admin);
            } catch (error) {
                console.error("Error fetching admin data:", error);
                Alert.alert("Error", "Unable to fetch admin data.");
            }
        };
        findAdmin();
    }, [course]);

    const handlePress = () => navigation.navigate('Classroom', course);
    const handleLongPress = () => console.log('Card long-pressed');

    const deleteClass = async () => {
        try {
            const userId = await AsyncStorage.getItem('uname');
            if (!userId) return;

            const response = await axios.delete(`https://${GLOBAL_CONFIG.SYSTEM_IP}/createClass/${course}/${userId}/${admin}/${instructor}`);
            console.log(response.data.message);

            Alert.alert('Success', 'Classroom deleted successfully!');
            fetchClasses();
        } catch (error) {
            console.error('Error deleting class:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <View>
            <ScrollView>
                <Card
                    mode="elevated"
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    style={styles.card}
                >
                    <Card.Content>
                        <Title style={styles.title}>{subject}</Title>
                        <Paragraph style={styles.paragraph}>{instructor}</Paragraph>
                        <Paragraph style={styles.role}>{admin ? '[Admin]' : '[Student]'}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={deleteClass} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" color='white' size={20} />
                        </Button>
                    </Card.Actions>
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = {
    card: {
        flex: 1,
        margin: 10,
        borderWidth: 1,
        borderColor: '#3C0A6B',
        borderRadius: 10,
        shadowColor: '#3C0A6B',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 21,
        marginBottom: 10,
        fontWeight: '500',
    },
    role: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: '400',
    },
    deleteButton: {
        backgroundColor: '#3C0A6B',
    }
};

export default CardDetails;
