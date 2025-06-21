import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PasswordProtectPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleSubmit = () => {
    if (password === '1234') {
      router.replace('/(tabs)/home');
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Protected Area</ThemedText>
      <ThemedText style={styles.subtitle}>
        Please enter the password to access this site.
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          { backgroundColor, color: textColor, borderColor: tintColor },
        ]}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSubmit}
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      <Pressable style={[styles.button, { backgroundColor: tintColor }]} onPress={handleSubmit}>
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 12,
  },
});
