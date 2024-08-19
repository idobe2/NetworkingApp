import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
} from 'react-native-paper'
import UserApi from '../api/UserApi';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerContent = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UserApi.getUserDetails();
        if (user) {
          console.log("user: ", user);
          setUserDetails(user);
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getUserTypeIcon = (userType) => {
    if (userType === 'google') {
      return <Icon name="google" size={30} color={theme.colors.primary} />;
    } else {
      return <Icon name="account" size={30} color={theme.colors.primary} />;
    }
  };

  return (
    <DrawerContentScrollView>
        <View style={styles.iconContainer}>
            {getUserTypeIcon(userDetails.userType)}
          </View>
      <View style={styles.drawerContent}>
    
        <View style={styles.userInfoSection}>
          <Avatar.Image
          style= {{top:30}}
            size={80}
            source={{
              uri:
                `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=
                ${userDetails.name.split(' ').slice(0, -1).join(' ')}+
                ${userDetails.name.split(' ').slice(-1).join(' ')}&size=250`,
            }}
          />
         
          <Title style={styles.title}>{userDetails.name}</Title>
          <Caption style={styles.caption}>{userDetails.email}</Caption>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    bottom: 30,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    top:15,
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    top:15,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
  },
})

export default DrawerContent;
