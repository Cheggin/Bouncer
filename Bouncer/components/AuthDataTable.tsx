import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define an interface for the data from the 'profiles' table
interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  risk_level: number | null;
  created_at: string;
}

interface AuthDataTableProps {
  lowRiskThreshold?: number;
  highRiskThreshold?: number;
}

export default function AuthDataTable({ 
  lowRiskThreshold = 33, 
  highRiskThreshold = 66 
}: AuthDataTableProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'text') + '20';

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel <= lowRiskThreshold) {
      return '#44aa44'; // Solid green for low risk
    } else if (riskLevel <= highRiskThreshold) {
      return '#ffaa00'; // Solid orange for medium risk
    } else {
      return '#ff4444'; // Solid red for high risk
    }
  };

  useEffect(() => {
    fetchProfilesData();
  }, []);

  const fetchProfilesData = async () => {
    try {
      setLoading(true);
      setRefreshing(false);
      
      // Query the public.profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles data:', error);
        return;
      }

      if (!data || data.length === 0) {
        return;
      }

      setProfiles(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <View 
      style={[
        styles.tableRow, 
        { 
          borderBottomColor: borderColor,
          backgroundColor: item.risk_level !== null ? getRiskColor(item.risk_level) : undefined
        }
      ]}
    >
      <Text style={[styles.cell, { color: textColor }]}>{item.full_name || 'N/A'}</Text>
      <Text style={[styles.cell, { color: textColor }]}>{item.email || 'N/A'}</Text>
      <Text style={[styles.cell, styles.riskCell, { color: textColor }]}>{item.risk_level ?? 'N/A'}</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: borderColor }]}>
      <Text style={[styles.headerCell, { color: textColor }]}>Name</Text>
      <Text style={[styles.headerCell, { color: textColor }]}>Email</Text>
      <Text style={[styles.headerCell, styles.riskCell, { color: textColor }]}>Risk Level</Text>
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        User Risk Levels
      </ThemedText>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchProfilesData}
          />
        }
      >
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: borderColor }]}>
            <Text style={[styles.headerCell, { color: textColor }]}>Name</Text>
            <Text style={[styles.headerCell, { color: textColor }]}>Email</Text>
            <Text style={[styles.headerCell, styles.riskCell, { color: textColor }]}>Risk Level</Text>
          </View>

          {/* Table Body */}
          {profiles.map((profile) => (
            <View 
              key={profile.id} 
              style={[
                styles.tableRow, 
                { borderBottomColor: borderColor }
              ]}
            >
              <Text style={[styles.cell, { color: textColor }]}>{profile.full_name || 'N/A'}</Text>
              <Text style={[styles.cell, { color: textColor }]}>{profile.email || 'N/A'}</Text>
              <Text 
                style={[
                  styles.cell, 
                  styles.riskCell, 
                  { 
                    color: profile.risk_level !== null ? getRiskColor(profile.risk_level) : textColor,
                    fontWeight: 'bold'
                  }
                ]}
              >
                {profile.risk_level ?? 'N/A'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
    textAlign: 'left',
  },
  table: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  cell: {
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
  tableHeader: {
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginBottom: 8,
  },
}); 