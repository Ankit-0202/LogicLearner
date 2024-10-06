// components/SnackbarContext.js

import React, { createContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(null);

  const showSnackbar = (msg, actionLabel = null, actionHandler = null) => {
    setMessage(msg);
    if (actionLabel && actionHandler) {
      setAction({ label: actionLabel, onPress: actionHandler });
    } else {
      setAction(null);
    }
    setVisible(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={action}
        style={{ backgroundColor: '#B00020' }} // Red color for errors
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
