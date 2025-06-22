import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, children, ...props }) => {
  return (
    <Text 
      style={[
        {
          color: '#111827',
          fontSize: 16,
        },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}; 