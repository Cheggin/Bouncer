import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define an interface for the data from the 'profiles' table
interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  created_at: string;
  risk_level?: number;
  // Add other fields from your 'profiles' table here
}

export default function AuthDataTable() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfilesData();
  }, []);

  const fetchProfilesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Query the public.profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles data:', error);
        setError('Failed to fetch data from the "profiles" table. Please check your RLS policies.');
        return;
      }

      if (!data || data.length === 0) {
        setError('No profiles found in the "profiles" table.');
        return;
      }

      setProfiles(data);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: number | undefined) => {
    if (!riskLevel) return '#999';
    if (riskLevel > 50) return '#ff4444'; // Red for high risk
    if (riskLevel > 25) return '#ffaa00'; // Orange for medium risk
    return '#44aa44'; // Green for low risk
  };

  const tableBorderColor = useThemeColor({}, 'tint');

  const renderItem = ({ item }: { item: Profile }) => (
    <View style={[styles.dataRow, { borderBottomColor: tableBorderColor }]}>
      <ThemedText style={[styles.dataCell, styles.nameCell]} numberOfLines={1}>
        {item.full_name || 'N/A'}
      </ThemedText>
      <ThemedText 
        style={[
          styles.dataCell, 
          styles.riskCell, 
          { color: getRiskLevelColor(item.risk_level) }
        ]}
      >
        {item.risk_level || 'N/A'}
      </ThemedText>
    </View>
  );

  const ListHeader = () => (
    <View style={[styles.headerRow, { borderBottomColor: tableBorderColor }]}>
      <ThemedText style={[styles.headerCell, styles.nameCell]}>Full Name</ThemedText>
      <ThemedText style={[styles.headerCell, styles.riskCell]}>Risk Level</ThemedText>
    </View>
  );

  const EmptyList = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No profiles found</ThemedText>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading Profiles Data...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        User Risk Levels
      </ThemedText>
      <FlatList
        data={profiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyList}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
    textAlign: 'left',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginBottom: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  dataCell: {
    textAlign: 'left',
  },
  nameCell: {
    flex: 0.7,
  },
  riskCell: {
    flex: 0.3,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontStyle: 'italic',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  helpText: {
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  setupButton: {
    color: '#007AFF',
    textAlign: 'center',
    padding: 8,
  },
}); 