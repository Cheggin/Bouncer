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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          {/* Header */}
          <View style={{ backgroundColor: '#ffffff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color="#0654ba" />
              <Text style={{ color: '#0654ba', fontSize: 16, marginLeft: 8, fontWeight: '500' }}>Back</Text>
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#0654ba', letterSpacing: -1, marginBottom: 8 }}>eGun</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 4 }}>Create Account</Text>
              <Text style={{ fontSize: 14, color: '#767676', textAlign: 'center' }}>Join the eGun marketplace</Text>
            </View>
          </View>

          {/* Form */}
          <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}>
            {error ? (
              <View style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20 }}>
                <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text>
              </View>
            ) : null}

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Full Name *</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="person-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="Your full name"
                  placeholderTextColor="#767676"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Date of Birth</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="calendar-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#767676"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Email *</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="mail-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="your@email.com"
                  placeholderTextColor="#767676"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>City</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="business-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="Your city"
                  placeholderTextColor="#767676"
                  value={city}
                  onChangeText={setCity}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Zip Code</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="map-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="Your zip code"
                  placeholderTextColor="#767676"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Password *</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="lock-closed-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="Enter password"
                  placeholderTextColor="#767676"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{ padding: 4 }}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#767676" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Confirm Password *</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
                <Ionicons name="lock-closed-outline" size={20} color="#767676" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 16, color: '#000000' }}
                  placeholder="Confirm password"
                  placeholderTextColor="#767676"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={{ padding: 4 }}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color="#767676" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={{ backgroundColor: loading ? '#94a3b8' : '#0654ba', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 }} 
              onPress={handleSignup} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>Create Account</Text>
              )}
            </TouchableOpacity>
              
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ fontSize: 14, color: '#767676' }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)} disabled={loading}>
                <Text style={{ fontSize: 14, color: '#0654ba', fontWeight: 'bold' }}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignupScreen; 