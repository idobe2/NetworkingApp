import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Text } from 'react-native-paper'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { theme } from '../core/theme'
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome icons

export default function TopBar({ title }) {
  const handleMenuPress = () => {
    alert('Menu button pressed!')
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleMenuPress}>
        <View style={styles.menuButton}>
          {/* Replace 'bars' with the icon name representing a menu */}
          <Icon name="bars" size={20} color="#000" />
        </View>
      </TouchableWithoutFeedback>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingTop: 16 + getStatusBarHeight(),
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56 + getStatusBarHeight(),
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    paddingRight: 35,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
  },
})
