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

export const showToastError = (title, err) => {
  let errorMessage = '';
  if (err?.data?.errors) {
    const errorsObj = err.data.errors;
    if (typeof errorsObj === 'object') {
      const keys = Object.keys(errorsObj);
      if (keys.length > 0) {
        const fieldErrors = errorsObj[keys[0]];
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          errorMessage = fieldErrors[0];
        } else if (typeof fieldErrors === 'string') {
          errorMessage = fieldErrors;
        }
      }
    }
  }
  if (!errorMessage) {
    errorMessage =
      err?.data?.message ||
      err?.message ||
      'Something went wrong. Please try again.';
  }
  showToast(title, errorMessage, 'error');
};

// This is the component you must include in your App.js
export default ToastMessage;
