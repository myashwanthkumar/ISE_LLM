import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { GLOBAL_CONFIG } from "../../components/global_config";

export default function Dates({ navigation, route }) {
  const { course } = route.params;
  const [dates, setDates] = useState([]);

  const getDates = async () => {
    try {
      const response = await axios.post(
        `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Attendance/dates`,
        { course }
      );
      console.log("Dates:", response.data);
      setDates(response.data);
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDates();
    }, [])
  );

  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Present", { course, date: item.date })}
    >
      <Text style={styles.buttonText}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={dates}
          keyExtractor={(item) => item.date}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={renderDateItem}
        />
      </View>
      <View style={styles.takeAttendance}>
        <TouchableOpacity
          style={styles.buttonAttendance}
          onPress={() => navigation.navigate("Mark", { course })}
        >
          <Text style={styles.buttonTextAttendance}>Take Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  buttonText: {
    color: "#3C0A6B",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    flex: 1,
    backgroundColor: "#D4BEE4",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  takeAttendance: {
    alignSelf: "stretch",
    padding: 10,
    backgroundColor: "white",
  },
  buttonAttendance: {
    backgroundColor: "#3C0A6B",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "95%",
    alignSelf: "center",
  },
  buttonTextAttendance: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
