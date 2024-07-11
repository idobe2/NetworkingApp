import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoadLevelSlider = ({ value, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.sliderLabel}>Load Level</Text>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="info-circle" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={3}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#007bff"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#007bff"
      />
      <View style={styles.sliderValues}>
        <Icon name="circle-o" size={30} color={value === 2 ? "#007bff" : "#d3d3d3"} />
        <Icon name="dot-circle-o" size={30} color={value === 3 ? "#007bff" : "#d3d3d3"} />
        <Icon name="circle" size={30} color={value === 4 ? "#007bff" : "#d3d3d3"} />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Load Level Information</Text>
              <Text style={styles.modalText}>1 - Low: Minimal activities, relaxing trip.</Text>
              <Text style={styles.modalText}>2 - Medium: Balanced activities, moderate pace.</Text>
              <Text style={styles.modalText}>3 - High: Packed schedule, lots of activities.</Text>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  slider: {
    height: 40,
    width: '100%',
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoadLevelSlider;
