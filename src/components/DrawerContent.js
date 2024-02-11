import React from 'react'
import { View, StyleSheet } from 'react-native'
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper'
import { SettingsIcon } from '../assets/icons'

export default function DrawerContent() {
  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            size={80}
            source={{
              uri:
                'https://instagram.ftlv1-1.fna.fbcdn.net/v/t51.2885-19/359979335_318139347307470_1230971796262779820_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.ftlv1-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=Dygs56mUqEgAX_eZJOh&edm=ABmJApABAAAA&ccb=7-5&oh=00_AfDHvJbjs-hzF76KVYZT47OZHmHfuNf-6OQyN2eBWx4XiA&oe=65CEFA46&_nc_sid=b41fef',
            }}
          />
          <Title style={styles.title}>YaDoo</Title>
          <Caption style={styles.caption}>@ido_bennoun</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                54
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                199
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Settings"
            icon={({ color }) => <SettingsIcon fill={color} />}
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Notifications</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})
