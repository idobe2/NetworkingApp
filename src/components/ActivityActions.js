import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ActivityActions({ onEdit, onDelete, onCalendar }) {
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onEdit}>
        <Icon name="pencil" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCalendar}>
        <Icon name="calendar" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Icon name="delete" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
    fontSize: 28,
    color: 'grey',
  },
});
