import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import Button from "../components/Button";
import { Calendar } from "react-native-calendars";

const SelectDatesModal = ({ visible, onClose, onDayPress, markedDates }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Calendar
          onDayPress={onDayPress}
          markingType={"period"}
          markedDates={markedDates}
        />
        <Button mode="contained" onPress={onClose}>
          OK
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    marginTop: 200,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SelectDatesModal;
