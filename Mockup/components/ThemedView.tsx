import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ style, children, ...props }) => {
  return (
    <View 
      style={[
        {
          backgroundColor: 'transparent',
        },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}; 