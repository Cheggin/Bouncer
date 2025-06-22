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
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 4 }}>Welcome Back</Text>
              <Text style={{ fontSize: 14, color: '#767676', textAlign: 'center' }}>Sign in to your eGun account</Text>
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
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Email</Text>
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

            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 8 }}>Password</Text>
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

            <TouchableOpacity 
              style={{ backgroundColor: loading ? '#94a3b8' : '#0654ba', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 }} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
              )}
            </TouchableOpacity>
              
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#767676' }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup' as any)} disabled={loading}>
                <Text style={{ fontSize: 14, color: '#0654ba', fontWeight: 'bold' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen; 