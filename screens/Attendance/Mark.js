import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, Switch } from "react-native";
import axios from "axios";
import { GLOBAL_CONFIG } from "../../components/global_config";

export default function Mark({ navigation, route }) {
  const { course } = route.params;
  const formattedDate = new Date().toISOString().split("T")[0];

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/attendance`,
          { params: { course, date: formattedDate } }
        );
        if (response.status !== 300) {
          const attendanceMap = response.data.reduce((acc, student) => {
            acc[student._id] = true;
            return acc;
          }, {});
          setSelectedStudents(attendanceMap);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, [course, formattedDate]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.post(
          `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/students`,
          { course }
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [course]);

  const handleToggle = (studentId) => {
    setSelectedStudents((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSubmit = async () => {
    const attendanceList = Object.keys(selectedStudents).filter(
      (studentId) => selectedStudents[studentId]
    );
    try {
      await axios.post(
        `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/attendance`,
        { date: formattedDate, course, attendance: attendanceList }
      );
      Alert.alert("Success", "Attendance marked successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to mark attendance");
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <View style={styles.container}>
      {students.length === 0 ? (
        <Text style={styles.noStudentsText}>No students enrolled.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item._id || item.uname}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.studentName}>{`${item.name} (${item.uname})`}</Text>
              <Switch
                value={!!selectedStudents[item._id]}
                onValueChange={() => handleToggle(item._id)}
                thumbColor={selectedStudents[item._id] ? "#ffffff" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#3C0A6B" }}
              />
            </View>
          )}
        />
      )}

      {students.length > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3C0A6B",
    paddingLeft: 20,
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3C0A6B",
  },
  submitContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#3C0A6B",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "95%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
