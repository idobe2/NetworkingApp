import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import Button from './Button';
import Header from './Header';
import Paragraph from './Paragraph';

const InfoModal = ({ visible, onClose }) => {
  const handleDial = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Header>Emergency Information</Header>
          <Paragraph>Location: XYZ</Paragraph>
          <Paragraph>Nearest Hospital: ABC Hospital</Paragraph>
          {/* <Paragraph>Emergency Contact: +911</Paragraph> */}
          <Button
            mode="contained"
            onPress={() => handleDial('911')}
            style={styles.button}
          >
            Call Emergency
          </Button>
          <Button
            mode="contained"
            onPress={onClose}
            style={[styles.button, styles.buttonClose]}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
    width: '100%',
    bottom: -10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InfoModal;
