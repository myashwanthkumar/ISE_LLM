import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, TextInput } from 'react-native';
import debounce from 'lodash.debounce';
import { GLOBAL_CONFIG } from '../../components/global_config';

export default function Signup({ navigation }) {
  const [username, setUsername] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);

  const handlePress = () => {
    if (isAvailable) {
      navigation.navigate("Details", { username });
    } else {
      setStatusMessage("Please pick a valid username.");
    }
  };

  const checkAvailability = async (username) => {
    if (!username.trim()) {
      setStatusMessage('');
      setIsAvailable(false);
      return;
    }

    try {
      console.log('Checking username:', username);
      const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/check`, { Name: username, fieldName: "uname" });

      console.log('Server Response:', response.data);
      if (response.data.available) {
        setStatusMessage("Username is available");
        setIsAvailable(true);
      } else {
        setStatusMessage("Username is unavailable");
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking username availability:', error.message);
    }
  };

  const delayCheckAvailability = useCallback(
    debounce((username) => checkAvailability(username), 300), 
    []
  );

  const handleUsernameChange = (text) => {
    setUsername(text);
    delayCheckAvailability(text);
  };

  return (
    <ImageBackground style={styles.container} source={require('../../assets/iit_tp.jpg')}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="New Username" 
          value={username} 
          onChangeText={handleUsernameChange} 
        />
        {statusMessage !== '' && (
          <Text style={[styles.statusText, { color: isAvailable ? "green" : "red" }]}>
            {statusMessage}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2',
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '85%',
    backgroundColor: 'white',
    opacity: 0.6,
  },
  statusText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: "white",
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
