import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert,
    KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { GLOBAL_CONFIG } from "../components/global_config";
import { LogBox } from 'react-native';

const AdminMarks = ({ navigation, route }) => {
    const course = route.params.course;
    const [selectedTest, setSelectedTest] = useState('');
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState([]);
    const [stats, setStats] = useState({ highest: "-", lowest: "-", average: "-" });
    const [maxMarks, setMaxMarks] = useState({ test1: "-", test2: "-", endSem: "-" });
    const [maxMarksLocal, setMaxMarksLocal] = useState({ test1: "-", test2: "-", endSem: "-" });

    useEffect(() => {
        fetchMaxMarks();
        fetchStudents();
    }, []);

    useEffect(() => {
        if (students.length > 0) calculateStats(students);
    }, [students]);

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const fetchMaxMarks = async () => {
        try {
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/maxmarks/getmaxmarks`, { classId: course });
            if (response.data.data) {
                setMaxMarks(response.data.data);
                setMaxMarksLocal(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching max marks:", error);
        }
    };

    const updateMaxMarks = async () => {
        if (!selectedTest) return Alert.alert("Error", "Please select a test.");
        try {
            await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/maxmarks/setmaxmarks`, {
                classId: course,
                ...maxMarksLocal
            });
            setMaxMarks(prev => ({ ...prev, [selectedTest]: maxMarksLocal[selectedTest] }));
            Alert.alert("Success", "Max Marks updated successfully!");
        } catch (error) {
            console.error("Error updating max marks:", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/marks/getmarks`, { course });
            setStudents(response.data.data);
            setMessage(response.data.empty);
            calculateStats(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateStats = (studentsData) => {
        const testTypes = ["test1", "test2", "endSem"];
        let newStats = {};
        testTypes.forEach(test => {
            let validMarks = studentsData.map(student => student[test]).filter(mark => mark !== "-").map(Number);
            newStats[test] = validMarks.length > 0 ? {
                highest: Math.max(...validMarks),
                lowest: Math.min(...validMarks),
                average: (validMarks.reduce((sum, mark) => sum + mark, 0) / validMarks.length).toFixed(2)
            } : { highest: "-", lowest: "-", average: "-" };
        });
        setStats(newStats);
    };

    const handleMarksChange = (id, value) => {
        setStudents(prev => prev.map(student => student._id === id ? { ...student, [selectedTest]: value } : student));
    };

    const handleSubmit = async () => {
        if (!selectedTest) return Alert.alert("Error", "Please select a test.");

        const invalidMarks = students.some(student => {
            const mark = parseInt(student[selectedTest], 10);
            const maxMark = parseInt(maxMarks[selectedTest], 10);
            return isNaN(mark) || isNaN(maxMark) || mark > maxMark || mark < 0;
        });

        if (invalidMarks) {
            return Alert.alert("Alert", `Some students have invalid entries for ${selectedTest}. Please verify.`);
        }

        try {
            await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/marks/setmarks`, { students });
            Alert.alert("Marks updated");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update marks. Try again.");
        }
    };

    const renderStudent = ({ item }) => (
        <View style={styles.studentCard}>
            <Text style={styles.studentName}>{item.name} ({item.userId})</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Marks"
                value={item[selectedTest] === "-" ? "" : item[selectedTest]}
                onChangeText={(value) => handleMarksChange(item._id, value)}
            />
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>
                            <Picker selectedValue={selectedTest} onValueChange={setSelectedTest} style={styles.picker}>
                                <Picker.Item label="Select Test" value="" />
                                <Picker.Item label="Test 1" value="test1" />
                                <Picker.Item label="Test 2" value="test2" />
                                <Picker.Item label="End Semester" value="endSem" />
                            </Picker>

                            {selectedTest && (
                                <View style={styles.maxMarksContainer}>
                                    <Text>Max Marks for {selectedTest}</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={maxMarksLocal[selectedTest] === "-" ? "" : String(maxMarksLocal[selectedTest])}
                                        onChangeText={(value) => setMaxMarksLocal(prev => ({ ...prev, [selectedTest]: value }))}
                                    />
                                    <TouchableOpacity onPress={updateMaxMarks}><Text>Update</Text></TouchableOpacity>
                                </View>
                            )}
                            <FlatList data={students} keyExtractor={(item) => item._id} renderItem={renderStudent} />
                            <TouchableOpacity onPress={handleSubmit}><Text>Submit</Text></TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default AdminMarks;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#4A148C",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#4A148C",
        borderRadius: 12,
        backgroundColor: "#ECEFF1",
        marginBottom: 20,
    },
    picker: {
        height: 50,
        color: "#4A148C",
    },
    statsContainer: {
        backgroundColor: "#D1C4E9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,

    },
    statsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4A148C",
        marginBottom: 5,
        textAlign: 'center',
        paddingBottom: 6
    },
    statsText: {
        fontSize: 18,
        color: "#311B92",
        textAlign: 'center',
        paddingBottom: 6
    },
    studentCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#D4BEE4",
        borderRadius: 10,
        marginBottom: 12,
    },
    studentName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3C0A6B",
        flex: 1,
    },
    input: {
        width: 80,
        padding: 10,
        borderWidth: 1,
        borderColor: "#7B1FA2",
        borderRadius: 8,
        textAlign: "center",
        backgroundColor: "#FFF",
    },
    submitButton: {
        backgroundColor: "#3C0A6B",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    noStudentsText: {
        textAlign: "center",
        fontSize: 16,
        color: "#D32F2F",
        marginVertical: 20,
    },
    maxMarksContainer: {
        backgroundColor: "#D1C4E9",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15
    },
    maxMarksTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4A148C"
    },
    maxMarksInput: {
        width: 100,
        padding: 10,
        borderWidth: 1,
        borderColor: "#7B1FA2",
        borderRadius: 8,
        textAlign: "center",
        backgroundColor: "#FFF",
        marginVertical: 8,
        fontSize: 15
    },
    updateButton: {
        backgroundColor: "#3C0A6B",
        padding: 10,
        borderRadius: 8,
        marginTop: 5
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});
