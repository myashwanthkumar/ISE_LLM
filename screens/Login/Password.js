import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity
} from "react-native";
import axios from "axios";
import { GLOBAL_CONFIG } from "../../components/global_config";

export default function Password({ route, navigation }) {
  const userDetails = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isMatch, setIsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSwitching = async () => {
    if (!password || !confirmPassword) return;
    
    try {
      const response = await axios.post(
        `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/store`, 
        { ...userDetails, password }
      );
      
      setStatusMessage("Data saved successfully!");
      console.log(response.data);
      navigation.navigate("Login");
    } catch (error) {
      setStatusMessage("Error saving data");
      console.error("Error saving:", error);
    }
  };

  const handleFinish = () => {
    if (password === confirmPassword) {
      setIsMatch(true);
      setIsLoading(true);
    } else {
      setIsMatch(false);
    }
  };

  return (
    <ImageBackground style={styles.container} source={require("../../assets/iit_tp.jpg")}>
      {!isLoading ? (
        <View style={styles.rectangle}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text>{passwordVisible ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Re-Enter Password"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Text>{confirmPasswordVisible ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          
          {!isMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
          
          <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.rectangle}>
          <Text style={styles.title}>User Created.</Text>
          <TouchableOpacity style={styles.button} onPress={handleSwitching}>
            <Text style={styles.buttonText}>Login Page</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  rectangle: {
    width: "80%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
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
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "60%",
  },
  buttonText: {
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
