import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import SubjectToAvailability from '../../components/SubjectToAvailability';
import { ValidateAge, ValidateEmail, ValidateName, ValidatePhoneNumber } from "../../components/Validations";
import DTimePicker from '../../components/DatePicker';

export default function Details({ route, navigation }) {
  const RULES = `1. Name should contain alphabets, only white spaces and . allowed\n2. Email should be in the proper format with domain name and @ symbol\n3. Phone Number should be a 10-digit number\n4. Age should be a number\n5. College should contain alphabets, white spaces and . symbols\n6. Date of Birth (At Least 17 years old) should match with Age.`;
  
  const { Uname } = route.params;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [number, setNumber] = useState('');
  const [dob, setDob] = useState(new Date());
  const [validEmail, setValidEmail] = useState(true);
  const [validName, setValidName] = useState(true);
  const [validCollege, setValidCollege] = useState(true);
  const [validNumber, setValidNumber] = useState(true);
  const [validAge, setValidAge] = useState(true);
  const [error, setError] = useState(false);
  const [inputsTouched, setInputsTouched] = useState(false);
  
  const findAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    return hasBirthdayPassed ? age : age - 1;
  };

  const validateAgeMatch = (date, age) => {
    return findAge(date) === age && age >= 17;
  };

  const handleDetails = () => {
    setInputsTouched(true);
    const age = findAge(dob);
    let isValid = true;
    
    if (!ValidateEmail(email)) {
      setValidEmail(false);
      isValid = false;
    } else setValidEmail(true);
    
    if (!ValidateAge(age)) {
      setValidAge(false);
      isValid = false;
    } else setValidAge(true);
    
    if (!ValidateName(college)) {
      setValidCollege(false);
      isValid = false;
    } else setValidCollege(true);
    
    if (!ValidatePhoneNumber(number)) {
      setValidNumber(false);
      isValid = false;
    } else setValidNumber(true);
    
    if (!ValidateName(name)) {
      setValidName(false);
      isValid = false;
    } else setValidName(true);
    
    if (!validateAgeMatch(dob, age)) {
      setError(true);
      isValid = false;
    } else setError(false);

    if (isValid) {
      navigation.navigate("Password", { Uname, email, age, college, number, name, dob });
    }
  };

  return (
    <ImageBackground source={require("../../assets/IIT_Admin_Block.png")} style={styles.container}>
      <View style={styles.rectangle}>
        <Image source={require("../../assets/hat_icon.png")} style={styles.mediumIcon} />
        {inputsTouched && !validAge && <Text style={styles.errorText}>Invalid Inputs</Text>}
        
        <TextInput style={[styles.input, { borderColor: validName ? 'white' : 'red' }]} placeholder='Name' value={name} onChangeText={setName} />
        <SubjectToAvailability Name={email} setName={setEmail} fieldName="email" placeholder="Email" Color={validEmail} />
        <SubjectToAvailability Name={number} setName={setNumber} fieldName="number" placeholder="Phone Number" Color={validNumber} />
        <TextInput style={[styles.input, { borderColor: validCollege ? 'white' : 'red' }]} placeholder='College' value={college} onChangeText={setCollege} />
        
        <View style={[styles.input, { borderColor: error ? 'red' : 'white' }]}>
          <View style={styles.dateContainer}>
            <Text>{dob ? dob.toLocaleDateString('en-IN') : "Date of Birth"}</Text>
            <DTimePicker date={dob} setDate={setDob} validateAge={ValidateAge} setError={setError} />
          </View>
        </View>
        
        <TouchableOpacity style={styles.smallButton} onPress={() => alert(RULES)}>
          <Image source={require("../../assets/help-icon.png")} style={styles.mediumIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDetails}>
          <Text style={styles.buttonText}>Next</Text>
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
  },
  rectangle: {
    width: '90%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  mediumIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.6,
    width: "89%",
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  smallButton: {
    padding: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
