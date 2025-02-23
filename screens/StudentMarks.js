import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, LogBox } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GLOBAL_CONFIG } from "../components/global_config";

const StudentMarks = ({ route }) => {
    const { course } = route.params;
    const [marks, setMarks] = useState(null);
    const [stats, setStats] = useState({});
    const [maxMarks, setMaxMarks] = useState({ test1: "-", test2: "-", endSem: "-" });

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        fetchMaxMarks();
        fetchStudentMarks();
    }, []);

    const fetchMaxMarks = async () => {
        try {
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/maxmarks/getmaxmarks`, { classId: course });
            if (response.data.data) {
                setMaxMarks(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching max marks:", error);
        }
    };

    const fetchStudentMarks = async () => {
        try {
            const user = (await AsyncStorage.getItem("uname"))?.toLowerCase();
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/marks/getmarks/student`, { course, user });
            
            if (response.data && Object.keys(response.data).length > 0) {
                setMarks(response.data);
                calculateStats();
            } else {
                setMarks(null);
                setStats({});
            }
        } catch (error) {
            console.error("Error fetching student marks:", error);
            setMarks(null);
            setStats({});
        }
    };

    const calculateStats = async () => {
        try {
            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/marks/getmarks`, { course });
            
            if (!response.data || response.data.length === 0) {
                setStats(defaultStats());
                return;
            }

            const computedStats = computeStats(response.data.data);
            setStats(computedStats);
        } catch (error) {
            console.error("Error calculating stats:", error);
            setStats({});
        }
    };

    const defaultStats = () => ({
        test1: { highest: "-", minimum: "-", average: "-" },
        test2: { highest: "-", minimum: "-", average: "-" },
        endSem: { highest: "-", minimum: "-", average: "-" },
    });

    const computeStats = (data) => {
        const tests = ["test1", "test2", "endSem"];
        return tests.reduce((acc, test) => {
            const validMarks = data.map(student => Number(student[test])).filter(Number.isFinite);
            acc[test] = validMarks.length > 0 ? {
                highest: Math.max(...validMarks),
                minimum: Math.min(...validMarks),
                average: (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(2),
            } : { highest: "-", minimum: "-", average: "-" };
            return acc;
        }, {});
    };

    const keyFormatter = (key) => ({ test1: "Test 1", test2: "Test 2", endSem: "End Semester" }[key] || key);

    const renderMarks = ({ item }) => (
        <View style={styles.markCard}>
            <Text style={styles.markLabel}>{keyFormatter(item.key)} :</Text>
            <Text style={styles.markValue}>{item.value}</Text>
            {stats[item.key] && (
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>🎯 Total Marks : {maxMarks[item.key]}</Text>
                    <Text style={styles.statsText}>📊 Highest : {stats[item.key]?.highest}</Text>
                    <Text style={styles.statsText}>📉 Lowest : {stats[item.key]?.minimum}</Text>
                    <Text style={styles.statsText}>📈 Average : {stats[item.key]?.average}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Your Marks</Text>
                <View style={styles.border}>
                    {marks ? (
                        <FlatList
                            nestedScrollEnabled
                            data={Object.entries(marks).map(([key, value]) => ({ key, value }))}
                            keyExtractor={(item) => item.key}
                            renderItem={renderMarks}
                        />
                    ) : (
                        <Text style={styles.noData}>No marks available</Text>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default StudentMarks;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#FFFDF0" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#3C0A6B" },
    noData: { textAlign: "center", color: "#3C0A6B", fontSize: 16 },
    markCard: { flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: 15, marginBottom: 10, backgroundColor: "#E9DFF3", borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    markLabel: { fontSize: 20, fontWeight: "bold", color: "#3C0A6B" },
    markValue: { fontSize: 19, color: "#3C0A6B", fontWeight: "bold" },
    border: { borderWidth: 1, borderColor: "#3C0A6B", borderRadius: 8, padding: 10 },
    statsContainer: { marginTop: 10, padding: 10, backgroundColor: "#D4BEE4", borderRadius: 8, alignItems: "center", width: "100%" },
    statsText: { fontSize: 17, fontWeight: "bold", color: "#3C0A6B", paddingBottom: 3 },
});
