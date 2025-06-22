import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

const CheckEmailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email } = params;

  return (
    <LinearGradient
      colors={['#f8f9fa', '#ffffff', '#f8f9fa']}
      style={styles.container}
    >
      <ThemedView style={styles.contentContainer}>
        <Ionicons name="mail-unread-outline" size={80} color="#106b0c" />
        <ThemedText style={styles.title}>Check Your Email</ThemedText>
        <ThemedText style={styles.subtitle}>
          We've sent a confirmation link to:
        </ThemedText>
        <Text style={styles.emailText}>{email}</Text>
        <ThemedText style={styles.instructionText}>
          Please click the link in the email to verify your account and complete the signup process.
        </ThemedText>
        
        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <LinearGradient
            colors={['#106b0c', '#0d5a0a']}
            style={styles.buttonGradient}
          >
            <ThemedText style={styles.buttonText}>Back to Login</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Ionicons name="arrow-back" size={20} color="#636E72" />
            <ThemedText style={styles.backLinkText}>Back to Signup</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#106b0c',
    marginVertical: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backLinkText: {
    color: '#636E72',
    fontSize: 16,
    marginLeft: 5,
  }
});

export default CheckEmailScreen; 