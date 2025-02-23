import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBAL_CONFIG } from '../components/global_config';
import SlideMenu from '../components/SlideMenu';

const CreateClass = () => {
  const [formData, setFormData] = useState({
    className: '',
    subjectName: '',
    instructorName: '',
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    const { className, subjectName, instructorName } = formData;

    if (!className || !subjectName || !instructorName) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const user = await AsyncStorage.getItem('uname');
      const userId = user.toLowerCase();

      const payload = { className, subjectName, instructorName, userId };
      const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/createClass`, payload);

      if (response.status === 201) {
        Alert.alert('Success', 'Classroom created successfully!');
        setFormData({ className: '', subjectName: '', instructorName: '' });
      } else {
        Alert.alert('Error', 'Failed to create classroom. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong!');
      console.error(error);
    }
  };

  const renderInputField = (label, field, icon) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Classroom</Text>

      {renderInputField('Course Code', 'className', <FontAwesome name="building" size={20} color="#3C0A6B" />)}
      {renderInputField('Subject Name', 'subjectName', <MaterialIcons name="menu-book" size={20} color="#3C0A6B" />)}
      {renderInputField('Instructor Name', 'instructorName', <FontAwesome name="user" size={20} color="#3C0A6B" />)}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>

      <SlideMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3C0A6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateClass;
