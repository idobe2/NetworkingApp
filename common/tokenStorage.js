import * as SecureStore from 'expo-secure-store';

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync('accessToken');
  } catch (error) {
    console.error('Error fetching access token', error);
  }
};

export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync('refreshToken');
  } catch (error) {
    console.error('Error fetching refresh token', error);
  }
};

export const setToken = async (accessToken: any, refreshToken: any) => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error setting tokens', error);
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (error) {
    console.error('Error removing tokens', error);
  }
};
