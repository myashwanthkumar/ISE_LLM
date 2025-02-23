import React, { useEffect, useState, useCallback } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    FlatList, 
    ActivityIndicator, 
    Alert 
} from "react-native";
import axios from "axios";
import { GLOBAL_CONFIG } from "../components/global_config";
import { SafeAreaView } from "react-native-safe-area-context";

const QuizList = ({ route, navigation }) => {
    const { courseId, userId, admin } = route.params;
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        try {
            console.log("Fetching quizzes...");
            const response = await axios.get(`https://${GLOBAL_CONFIG.SYSTEM_IP}/quiz?courseId=${courseId}`);
            setQuizzes(response.data || []);
            console.log("Fetched Quizzes:", response.data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            Alert.alert("Error", "Failed to load quizzes.");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleAddQuiz = () => {
        const newQuizNumber = quizzes.length + 1;
        navigation.navigate("CreateQuiz", { quizNumber: newQuizNumber, courseId, userId });
    };

    const renderQuizItem = ({ item }) => (
        <TouchableOpacity
            style={styles.quizButton}
            onPress={() => navigation.navigate("Quiz", {
                quizNumber: item.quizNumber,
                courseId,
                admin,
                userId
            })}
        >
            <Text style={styles.quizText}>{`Quiz ${item.quizNumber}`}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : quizzes.length === 0 ? (
                <Text style={styles.noQuizText}>No quizzes available.</Text>
            ) : (
                <>
                    <Text style={styles.title}>Select a Quiz</Text>
                    <FlatList
                        data={quizzes}
                        keyExtractor={(item) => item._id}
                        renderItem={renderQuizItem}
                        style={styles.list}
                    />
                </>
            )}

            {admin && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddQuiz}>
                    <Text style={styles.addButtonText}>+ Add Quiz</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default QuizList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#3C0A6B",
    },
    list: {
        flex: 1,
        width: "80%",
    },
    quizButton: {
        backgroundColor: "#3C0A6B",
        padding: 18,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    quizText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    addButton: {
        marginTop: 20,
        backgroundColor: "#3C0A6B",
        padding: 15,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
    },
    addButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    noQuizText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
    },
});
