import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = ({ navigation }) => {
  useEffect(() => {
    handleLogout();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      // await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/logout`);
      await AsyncStorage.clear();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3C0A6B" />
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
