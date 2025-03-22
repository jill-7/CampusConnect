import 'react-native';
import type { TextStyle, StyleProp } from 'react-native';

declare module 'react-native' {
  interface TextProps {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>; 
  }
}