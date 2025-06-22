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
import { upsertUserData } from '../services/userDataService';

const SignupScreen: React.FC = () => {
  const router = useRouter();
  
  // Authentication state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Additional user data state
  const [name, setName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');

  const handleSignup = async (): Promise<void> => {
    setLoading(true);
    setError('');

    // Validation
    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting signup...');
      console.log('Email:', email);
      console.log('Name:', name);
      
      // Create user account with Supabase Auth (email, password, and display name)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { 
            full_name: name,
            display_name: name 
          },
        },
      });
      
      console.log('Sign up response:', { data, error: signUpError });
      
      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        throw signUpError;
      }
      router.push({
        pathname: '/check-email',
        params: { email: email },
      });
      
      console.log('✅ Sign up successful, updating user profile in the background...');
      
      // Update user profile with additional data
      // The profile is automatically created by the database trigger
      if (data.user) {
        // No need to await this, let it run in the background
        upsertUserData(data.user.id, {
          full_name: name,
          email: email,
          date_of_birth: dateOfBirth,
          city: city,
          zip_code: zipCode,
        }).catch(err => {
          // Even if this fails, the user has been created and notified.
          // Log the error for debugging.
          console.error('❌ Background profile update error:', err);
        });
      }
      
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
                Create Account
              </ThemedText>
            </View>

            <View style={styles.form}>
              {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Full Name *</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="person-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Your full name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Date of Birth</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="MM/DD/YYYY"
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email *</ThemedText>
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
                <ThemedText style={styles.label}>City</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="business-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Your city"
                    value={city}
                    onChangeText={setCity}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Zip Code</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="map-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Your zip code"
                    value={zipCode}
                    onChangeText={setZipCode}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Password *</ThemedText>
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

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Confirm Password *</ThemedText>
                <View style={styles.passwordContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#106b0c" style={{ marginLeft: 16, marginRight: 12 }} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#636E72" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSignup} disabled={loading}>
                <LinearGradient
                  colors={['#106b0c', '#0d5a0a']}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.submitText}>
                      Create Account
                    </ThemedText>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.toggleContainer}>
                <ThemedText style={styles.toggleText}>
                  Already have an account?
                </ThemedText>
                <TouchableOpacity onPress={() => router.push('/login' as any)} disabled={loading}>
                  <ThemedText style={styles.toggleLink}>
                    Sign In
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

export default SignupScreen; 