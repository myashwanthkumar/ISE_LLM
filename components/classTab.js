import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function UserClass({ navigation, name }) {
    const handleClass = () => {
        navigation.navigate("Class Room", name);
    };

    return (
        <TouchableOpacity style={styles.modalView} onPress={handleClass}>
            <Text style={styles.buttonText}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 10,
        width: 200,
        backgroundColor: "#2196F3",
    },
    buttonText: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    addIcon: {
        width: 50,
        height: 50,
    },
});
