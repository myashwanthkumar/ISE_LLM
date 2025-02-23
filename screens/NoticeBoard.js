import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    LogBox,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBAL_CONFIG } from '../components/global_config';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function NoticeBoard({ navigation, route }) {
    const { admin, course } = route.params;
    const [notices, setNotices] = useState([]);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        fetchNotices();
        getUserId();

        const interval = setInterval(fetchNotices, 1000); // Auto-refresh every second
        return () => clearInterval(interval);
    }, []);

    const getUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('uname');
            setUserId(storedUserId || '');
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const fetchNotices = async () => {
        try {
            const response = await axios.get(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/notices/${course}`);
            setNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        }
    };

    const postNotice = async () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Message cannot be empty!');
            return;
        }

        try {
            await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/notices/add/${course}`, {
                message,
                uname: userId,
                isAdmin: admin,
            });
            setMessage('');
            fetchNotices();
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);
        } catch (error) {
            console.error('Error posting notice:', error);
            Alert.alert('Error', 'Unable to post message.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <FlatList
                    ref={flatListRef}
                    data={notices}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={[styles.notice, item.isAdmin ? styles.adminNotice : styles.userNotice]}>
                            <Text style={styles.noticeText}>
                                <Text style={styles.noticeUser}>{item.uname}:</Text> {item.message}
                            </Text>
                            <Text style={styles.noticeTime}>{new Date(item.timestamp).toLocaleString()}</Text>
                        </View>
                    )}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Message..."
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <TouchableOpacity style={styles.button} onPress={postNotice}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6F4',
    },
    listContainer: {
        paddingBottom: 80,
    },
    notice: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    noticeText: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    noticeUser: {
        fontWeight: 'bold',
        color: '#3C0A6B',
    },
    noticeTime: {
        fontSize: 12,
        color: '#3C0A6B',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#3C0A6B',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#3C0A6B',
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    userNotice: {
        backgroundColor: '#D4BEE4',
    },
    adminNotice: {
        backgroundColor: '#D4BEE4',
    },
});
