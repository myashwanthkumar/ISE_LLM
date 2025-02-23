export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  export function validateUserName(username) {
    const regex = /^[a-zA-Z\s]+$/; // Allows letters and spaces only
    return regex.test(username);
  }
  
  export function validatePhoneNumber(phoneNumber) {
    const regex = /^[6-9]\d{9}$/; // Starts with 6-9 and has exactly 10 digits
    return regex.test(phoneNumber);
  }
  
  export function validateAge(age) {
    const regex = /^\d+$/; // Allows only numeric values
    return regex.test(age);
  }
  
  export function validateName(name) {
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)*(\.[a-zA-Z]+)*$/; // Allows names with spaces or dots
    return regex.test(name);
  }
  