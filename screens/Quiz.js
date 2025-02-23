import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";
import axios from "axios";
import { RadioButton } from "react-native-paper";
import { GLOBAL_CONFIG } from "../components/global_config";
import { SafeAreaView } from "react-native-safe-area-context";

const Quiz = ({ route, navigation }) => {
    const { quizNumber, courseId, admin, userId } = route.params;
    const studentId = userId;

    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [previousAttempts, setPreviousAttempts] = useState([]);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, []);

    const shuffleOptions = (options) => options.sort(() => Math.random() - 0.5);

    const fetchQuiz = async () => {
        try {
            const url = `https://${GLOBAL_CONFIG.SYSTEM_IP}/quiz/${courseId}/${quizNumber}/${studentId}`;
            console.log("Fetching Quiz from:", url);

            const response = await axios.get(url);
            const quizData = response.data.quiz;

            setQuiz({
                ...quizData,
                questions: quizData.questions.map((q) => ({
                    ...q,
                    shuffledOptions: shuffleOptions([...q.options]),
                })),
            });

            setPreviousAttempts(response.data.previousAttempts);
            setTotalAttempts(response.data.totalAttempts);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            Alert.alert("Error", "Failed to load quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnswer = (questionId, option) => {
        setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
    };

    const submitQuiz = async () => {
        try {
            const formattedAnswers = quiz.questions.map((q, index) => ({
                questionId: index,
                selectedOption: selectedAnswers[index] || "",
            }));

            const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/quiz/submitQuiz`, {
                studentId,
                quizNumber,
                courseId,
                answers: formattedAnswers,
            });

            Alert.alert("Submitted!", `Your score: ${response.data.score}`);
            setSubmitted(true);
            fetchQuiz();
        } catch (error) {
            console.error("Error submitting quiz:", error);
            Alert.alert("Error", "Failed to submit quiz.");
        }
    };

    const renderQuestionItem = (question, index) => (
        <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>
                Question {index + 1}: {"\n\n"} {question.questionText}
            </Text>

            {question.shuffledOptions.map((option, optionIndex) => {
                const isSelected = selectedAnswers[index] === option;
                const isCorrect = option === question.correctAnswer;
                const isWrong = isSelected && !isCorrect;

                return (
                    <TouchableOpacity
                        key={optionIndex}
                        style={[
                            styles.optionButton,
                            isSelected && (isCorrect ? styles.correctOption : styles.wrongOption),
                        ]}
                        onPress={() => handleSelectAnswer(index, option)}
                    >
                        <RadioButton
                            value={option}
                            status={isSelected ? "checked" : "unchecked"}
                            onPress={() => handleSelectAnswer(index, option)}
                        />
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                );
            })}

            {(admin || submitted) && (
                <Text style={styles.correctAnswerText}>Correct Answer: {question.answer}</Text>
            )}
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#007bff" />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>{quiz.title}</Text>

                <TouchableOpacity
                    style={styles.quizStatsButton}
                    onPress={() => navigation.navigate("QuizStats", { quizNumber, courseId })}
                >
                    <Text style={styles.buttonText}>Quiz Stats</Text>
                </TouchableOpacity>

                {previousAttempts.length > 0 && (
                    <View style={styles.previousAttemptsContainer}>
                        <Text style={styles.previousAttemptsText}>Total Attempts: {totalAttempts}</Text>
                        <Text style={styles.previousAttemptsText}>Previous Scores:</Text>
                        {previousAttempts.map((attempt, index) => (
                            <Text key={index} style={styles.attemptScore}>
                                Attempt {index + 1}: {attempt.score} / {quiz.questions.length}
                            </Text>
                        ))}
                    </View>
                )}

                {quiz.questions.map(renderQuestionItem)}

                {!admin && (
                    <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
                        <Text style={styles.buttonText}>Submit Quiz</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Quiz;

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 15,
    },
    scrollContainer: {
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    quizStatsButton: {
        backgroundColor: "#3C0A6B",
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
    previousAttemptsContainer: {
        marginBottom: 20,
    },
    previousAttemptsText: {
        fontSize: 18,
        marginBottom: 10,
    },
    attemptScore: {
        fontSize: 16,
        color: "green",
    },
    questionContainer: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        elevation: 3,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#E8F0FE",
    },
    optionText: {
        fontSize: 16,
    },
    correctOption: {
        backgroundColor: "#D4EDDA",
    },
    wrongOption: {
        backgroundColor: "#F8D7DA",
    },
    correctAnswerText: {
        fontSize: 16,
        color: "green",
        marginTop: 5,
        paddingTop: 3,
    },
    submitButton: {
        backgroundColor: "#3C0A6B",
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
};
