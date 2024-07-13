import React from 'react';
import { View, StyleSheet } from 'react-native';
import Paragraph from './Paragraph';
// import Button from './Button';

const NoPlansMessage = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <Paragraph>It looks like you have no upcoming events at the moment. Please create your first travel plan. ✈️</Paragraph>
      {/* <Button mode="outlined" onPress={onGetStarted} style={styles.button}>
        Get Started
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
});

export default NoPlansMessage;
