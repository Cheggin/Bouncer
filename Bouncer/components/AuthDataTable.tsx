import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  role?: string;
}

export default function AuthDataTable() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthData();
  }, []);

  const fetchAuthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try multiple approaches to get auth data
      let data = null;
      let error = null;

      // Approach 1: Try using a function (if it exists)
      try {
        const result = await supabase.rpc('get_auth_users');
        if (result.data && !result.error) {
          data = result.data;
        }
      } catch (funcError) {
        console.log('Function approach failed, trying view...');
      }

      // Approach 2: Try using the view (if it exists)
      if (!data) {
        try {
          const result = await supabase
            .from('auth_users_view')
            .select('*')
            .order('created_at', { ascending: false });
          data = result.data;
          error = result.error;
        } catch (viewError) {
          console.log('View approach failed');
        }
      }

      // Approach 3: Try to get current user info as a fallback
      if (!data) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            data = [{
              id: user.id,
              email: user.email,
              created_at: user.created_at,
              updated_at: user.updated_at,
              last_sign_in_at: user.last_sign_in_at,
              role: user.user_metadata?.role || 'user'
            }];
          }
        } catch (userError) {
          console.log('User approach failed');
        }
      }

      if (error) {
        console.error('Error fetching auth data:', error);
        setError('Failed to fetch authentication data. Please check your Supabase configuration.');
        return;
      }

      if (!data || data.length === 0) {
        setError('No authentication data found. You may need to set up the database view or function.');
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const showSetupInstructions = () => {
    Alert.alert(
      'Setup Required',
      'To display authentication data, you need to create a database view or function in your Supabase dashboard. Check the SUPABASE_SETUP.md file for detailed instructions.',
      [
        { text: 'OK', style: 'default' },
        { text: 'Copy SQL', onPress: copySetupSQL }
      ]
    );
  };

  const copySetupSQL = () => {
    const sql = `-- Create a view to expose auth users data
CREATE OR REPLACE VIEW auth_users_view AS
SELECT 
  id,
  email,
  created_at,
  updated_at,
  last_sign_in_at,
  raw_user_meta_data->>'role' as role
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT ON auth_users_view TO anon;`;
    
    // For web, we can't directly copy to clipboard, but we can show it
    Alert.alert('SQL Commands', sql);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading authentication data...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <ThemedText style={styles.helpText}>
          Make sure you have:
        </ThemedText>
        <ThemedText style={styles.helpText}>
          • Set up your Supabase environment variables
        </ThemedText>
        <ThemedText style={styles.helpText}>
          • Created a view or function to access auth.users
        </ThemedText>
        <ThemedText style={styles.helpText}>
          • Proper RLS policies configured
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Text style={styles.setupButton} onPress={showSetupInstructions}>
            View Setup Instructions
          </Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Authentication Users ({users.length})
      </ThemedText>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>ID</Text>
              <Text style={styles.headerCell}>Email</Text>
              <Text style={styles.headerCell}>Created</Text>
              <Text style={styles.headerCell}>Last Sign In</Text>
              <Text style={styles.headerCell}>Role</Text>
            </View>
            
            {/* Data Rows */}
            {users.map((user) => (
              <View key={user.id} style={styles.dataRow}>
                <Text style={styles.dataCell} numberOfLines={1}>
                  {user.id.substring(0, 8)}...
                </Text>
                <Text style={styles.dataCell} numberOfLines={1}>
                  {user.email || 'N/A'}
                </Text>
                <Text style={styles.dataCell}>
                  {formatDate(user.created_at)}
                </Text>
                <Text style={styles.dataCell}>
                  {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                </Text>
                <Text style={styles.dataCell}>
                  {user.role || 'user'}
                </Text>
              </View>
            ))}
            
            {users.length === 0 && (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 100,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    minWidth: 100,
  },
  emptyRow: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  helpText: {
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 16,
  },
  setupButton: {
    backgroundColor: '#007AFF',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 