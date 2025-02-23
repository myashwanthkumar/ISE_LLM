import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GLOBAL_CONFIG } from '../../components/global_config';

export default function Dates({ navigation, route }) {
  const { course } = route.params;
  const [dates, setDates] = useState([]);
  const [attendedDates, setAttendedDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const user = (await AsyncStorage.getItem('uname')).toLowerCase();

        const [dateResponse, attendedResponse] = await Promise.all([
          axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/dates`, { course }),
          axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/UserAttendance`, { course, user })
        ]);

        setDates(dateResponse.data.map(entry => entry.date));
        setAttendedDates(attendedResponse.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchDates();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={dates}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.button,
              attendedDates.includes(item) ? styles.attendedTab : styles.missedTab
            ]}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 80 },
  button: {
    flex: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  attendedTab: { backgroundColor: "#3CB371" },
  missedTab: { backgroundColor: "#E97451" },
});
