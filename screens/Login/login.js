import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, Image, ImageBackground, 
  TextInput, TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API from '../../Middleware/API';
import { GLOBAL_CONFIG } from '../../components/global_config';

export default function LoginPage({ navigation }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [failure, setFailure] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    Alert.alert("Please contact the concerned TA");
  };

  const handleLogin = async () => {
    if (!userName || !password) return;
    setLoading(true);

    try {
      const response = await API.post(
        `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/login`, 
        { uname: userName, passwd: password }
      );
      
      const { accessToken, refreshToken, verified } = response.data;
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
      await AsyncStorage.setItem('uname', userName.toLowerCase());

      if (verified) {
        setUserName('');
        setPassword('');
        setFailure(false);
        navigation.reset({ index: 0, routes: [{ name: 'Home', params: { userName } }] });
      } else {
        setFailure(true);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setFailure(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../../assets/IIT_Admin_Block.png")} style={styles.container}>
      <View style={styles.rectangle}>
        <Image source={require("../../assets/hat_icon.png")} style={styles.mediumIcon} />

        <TextInput 
          style={styles.input} 
          placeholder="User Name" 
          value={userName} 
          onChangeText={setUserName} 
        />

        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Password" 
            secureTextEntry={!visible} 
            value={password} 
            onChangeText={setPassword} 
          />
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Text>{visible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {failure && <Text style={styles.errorText}>Wrong Username or Password!!</Text>}

        <TouchableOpacity style={styles.smallButton} onPress={handleForgotPassword}>
          <Text style={styles.smallText}>Forgot Password?</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.smallText}>New User? Sign Up</Text>
        </TouchableOpacity>
      </View>
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
  rectangle: {
    width: '80%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  mediumIcon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 10,
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
  passwordContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  smallButton: {
    padding: 10,
  },
  smallText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
