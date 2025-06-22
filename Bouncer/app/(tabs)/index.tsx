import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { StripeBackground } from '@/components/StripeBackground';
import { StyleSheet, TextInput, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DesignTokens } from '@/constants/Colors';

export default function PasswordProtectPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleSubmit = () => {
    if (password === '1234') {
      router.replace('/(tabs)/home');
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <StripeBackground variant="hero">
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="h1" style={styles.title}>
            Protected Area
          </ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Please enter the password to access this site.
          </ThemedText>
          
          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: DesignTokens.colors['white-000'], 
                  color: DesignTokens.colors['black-900'],
                  borderColor: DesignTokens.colors['gray-100'],
                },
              ]}
              placeholder="Password"
              placeholderTextColor={DesignTokens.colors['gray-400']}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
            />
            
            {error ? (
              <ThemedText type="small" style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}
            
            <ThemedButton
              title="Continue"
              variant="primary"
              onPress={handleSubmit}
              style={styles.button}
            />
          </View>
        </View>
      </ThemedView>
    </StripeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignTokens.layout.containerPadding,
    paddingVertical: DesignTokens.layout.sectionPadding.normal,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: DesignTokens.colors['white-000'],
    maxWidth: '12ch', // Design system specification
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    color: DesignTokens.colors['gray-100'],
    maxWidth: 320,
  },
  form: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontSize: DesignTokens.typography.fontSize.body,
    fontWeight: DesignTokens.typography.fontWeight.body,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
    textAlign: 'center',
  },
});
