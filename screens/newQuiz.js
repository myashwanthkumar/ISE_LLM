import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { GLOBAL_CONFIG } from "../components/global_config";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const QuizCreator = ({ navigation, route }) => {
  const { courseId, quizNumber } = route.params;
  const [questions, setQuestions] = useState([{ questionText: "", options: [], answer: "" }]);

  // Function to update question text
  const updateQuestionText = useCallback((index, text) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index].questionText = text;
      return updatedQuestions;
    });
  }, []);

  // Function to update option text
  const updateOptionText = useCallback((qIndex, oIndex, text) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex].options[oIndex] = text;
      return updatedQuestions;
    });
  }, []);

  // Function to update answer text
  const updateAnswerText = useCallback((qIndex, text) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex].answer = text;
      return updatedQuestions;
    });
  }, []);

  // Function to add a new option for a specific question
  const addOption = useCallback((qIndex) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex].options.push("");
      return updatedQuestions;
    });
  }, []);

  // Function to add a new question
  const addQuestion = () => {
    setQuestions((prev) => [...prev, { questionText: "", options: [], answer: "" }]);
  };

  // Function to delete a question
  const deleteQuestion = (qIndex) => {
    setQuestions((prev) => prev.filter((_, index) => index !== qIndex));
  };

  // Function to submit the quiz
  const submitQuiz = async () => {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].questionText.trim() === "" || questions[i].answer.trim() === "") {
        Alert.alert("Error", `Question ${i + 1} or its answer is empty.`);
        return;
      }
    }

    try {
      const formattedQuestions = questions.map((q) => ({
        ...q,
        options: [...q.options, q.answer], // Ensure the answer is included in the options
      }));

      const payload = { courseId, quizNumber, questions: formattedQuestions };

      const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/quiz`, payload);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", `Quiz ${quizNumber} saved successfully`);
        navigation.navigate("QuizList", { courseId, admin: true });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      Alert.alert("Error", "Failed to save quiz. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Create Quiz</Text>

          {questions.map((q, qIndex) => (
            <View key={qIndex} style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="Enter question..."
                value={q.questionText}
                onChangeText={(text) => updateQuestionText(qIndex, text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Correct Answer (Option 1)"
                value={q.answer}
                onChangeText={(text) => updateAnswerText(qIndex, text)}
              />
              {q.options.map((option, oIndex) => (
                <TextInput
                  key={oIndex}
                  style={styles.input}
                  placeholder={`Option ${oIndex + 2}`}
                  value={option}
                  onChangeText={(text) => updateOptionText(qIndex, oIndex, text)}
                />
              ))}

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.smallButton} onPress={() => addOption(qIndex)}>
                  <Text style={styles.buttonText}>Add Option</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={() => deleteQuestion(qIndex)}>
                  <Text style={styles.buttonText}>Delete Question</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={addQuestion}>
            <Text style={styles.buttonText}>Add Question</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={submitQuiz}>
            <Text style={styles.buttonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizCreator;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9DFF3",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#3C0A6B",
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#D4BEE4",
    marginBottom: 15,
    alignItems: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "85%",
    backgroundColor: "white",
    opacity: 0.6,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: "#3C0A6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#3C0A6B",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "60%",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
