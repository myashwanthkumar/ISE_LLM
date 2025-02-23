import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, Modal } from "react-native";
import SubjectToAvailability from "./SubjectToAvailability";

export default function ClassInput() {
    const [modalVisible, setModalVisibility] = useState(true);
    const [join, setJoin] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [validCode, setValidCode] = useState(true);

    return (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibility(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={{ flexGrow: 0.8 }}>
                        <Text style={styles.title}>Enter Class Code</Text>
                        <SubjectToAvailability
                            fieldName="ClassCode"
                            placeholder="Enter Class Code"
                            Name={classCode}
                            setName={setClassCode}
                            Color={validCode}
                        />
                        <TouchableOpacity style={styles.button} onPress={() => console.log("Joining Class")}>
                            <Text style={styles.buttonText}>Join Class</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                {!join && (
                    <TouchableOpacity style={styles.addIcon} onPress={() => setModalVisibility(false)}>
                        <Image source={require("../assets/back_arrow.jpg")} style={styles.addIcon} />
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    container: {
        flex: 1,
        backgroundColor: "gray",
    },
    button: {
        backgroundColor: "#005d5f",
        paddingVertical: 5,
        borderRadius: 5,
        alignSelf: "center",
        alignItems: "center",
        width: "60%",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        alignSelf: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    addIcon: {
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 50,
        height: 70,
        resizeMode: "contain",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: "90%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
