import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DTimePicker({ date, setDate, set, state, ValidateAge, seterror }) {
  const [isPickerShow, setIsPickerShow] = useState(false);

  const showPicker = () => setIsPickerShow(true);

  const onChange = (event, value) => {
    setDate(value);
    state(true);
    if (Platform.OS === 'android') {
      setIsPickerShow(false);
    }
  };

  return (
    <View>
      {!isPickerShow && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={showPicker}>
            <Image source={require("../assets/calendar.png")} style={styles.medium_icon} />
          </TouchableOpacity>
        </View>
      )}

      {isPickerShow && (
        <DateTimePicker
          value={date}
          mode={'date'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onChange}
          style={styles.datePicker}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
    opacity: 1,
    borderRadius: 5,
  },
  medium_icon: {
    opacity: 1,
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
