import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator, 
  Text,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { styles } from '../styles/authstyles';
import { supabase } from '../lib/supabase';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login...');
      console.log('Email:', email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      console.log('Sign in response:', { data, error: signInError });
      
      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        throw signInError;
      }
      
      console.log('✅ Sign in successful, navigating to profile...');
      router.push('/profile' as any);
      
    } catch (err) {
      console.error('❌ Authentication error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient
          colors={['#f8f9fa', '#ffffff', '#f8f9fa']}
          style={styles.container}
        >
          <ThemedView style={styles.formContainer}>
            <View style={styles.header}>
              <Ionicons name="shield-checkmark" size={60} color="#106b0c" />
              <ThemedText style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to your GunsPro account
              </ThemedText>
            </View>

            <View style={styles.form}>
              {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="mail-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#636E72" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={loading}>
                <LinearGradient
                  colors={['#106b0c', '#0d5a0a']}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.submitText}>
                      Sign In
                    </ThemedText>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.toggleContainer}>
                <ThemedText style={styles.toggleText}>
                  Don't have an account?
                </ThemedText>
                <TouchableOpacity onPress={() => router.push('/signup' as any)} disabled={loading}>
                  <ThemedText style={styles.toggleLink}>
                    Sign Up
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color="#636E72" />
              <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen; 