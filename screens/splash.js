import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, LogBox } from "react-native";

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

        // Fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        // Navigate after 5 seconds
        const timer = setTimeout(() => {
            navigation.replace("Login");
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, [fadeAnim, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.gradientBackground} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Logo />
                <Text style={styles.title}>EduSync</Text>
            </Animated.View>
        </View>
    );
};

// Minimal Logo Component
const Logo = () => (
    <View style={styles.logoContainer}>
        <Text style={styles.logoText}>📘🔄</Text> 
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3C0A6B",
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
        opacity: 0.4,
        zIndex: -1,
    },
    content: {
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: 10,
    },
    logoContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 50,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 40,
    },
});

export default SplashScreen;
