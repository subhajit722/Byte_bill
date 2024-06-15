import React from 'react';
import useKeyboardNavigation from './UsekeyboardNavigation';

const KeyboardNavigationProvider = ({ children }) => {
  useKeyboardNavigation();
  return <>{children}</>;
};

export default KeyboardNavigationProvider;
