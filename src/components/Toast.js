import React from 'react';
import ToastMessage from 'react-native-toast-message';

/**
 * Global Toast Helper
 * @param {string} title - The main heading (text1)
 * @param {string} message - The description (text2)
 * @param {'success' | 'error' | 'info'} type - Toast type
 */
export const showToast = (title, message, type = 'info') => {
  ToastMessage.show({
    text1: title,
    text2: message,
    type: type,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50, // Adjusts position below status bar
  });
};

// This is the component you must include in your App.js
export default ToastMessage;
