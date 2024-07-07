import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmationModal = ({ visible, onClose, onConfirm, onGoogleMaps, selectedActivity, caller }) => {
  if (!selectedActivity) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Selection</Text>
          <Text style={styles.modalText}>
            {caller === 'edit' ? 
              `Do you want to replace the current activity with ${selectedActivity.name}?` :
              `Do you want to add ${selectedActivity.name} as your meal location?`
            }
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>
                {caller === 'edit' ? 'Replace activity' : 'Add meal'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onGoogleMaps}>
              <Text style={styles.buttonText}>Open in Google Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConfirmationModal;
