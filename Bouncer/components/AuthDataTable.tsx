import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DesignTokens } from '@/constants/Colors';
import { CommonStyles } from '@/constants/Styles';
import { calculateRiskForAllUsers, RiskCalculationResult } from '@/services/riskCalculationService';

// Define an interface for the data from the 'profiles' table
interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  risk_level: number | null;
  risk_analysis?: string | null;
  risk_factors?: string[] | null;
  created_at: string;
}

interface AuthDataTableProps {
  lowRiskThreshold?: number;
  highRiskThreshold?: number;
  claudePrompt?: string;
  refreshKey?: number;
}

export default function AuthDataTable({ 
  lowRiskThreshold = 33, 
  highRiskThreshold = 66,
  claudePrompt = 'You are a risk assessment AI analyzing user data for potential security threats. Analyze the following user information and provide a risk score from 0-100.',
  refreshKey = 0
}: AuthDataTableProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calculatingRisk, setCalculatingRisk] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState<string>('');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'text') + '20';
  const tintColor = useThemeColor({}, 'tint');

  // Helper function to add debug logs
  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel <= lowRiskThreshold) {
      return '#44aa44'; // Solid green for low risk
    } else if (riskLevel <= highRiskThreshold) {
      return '#ffaa00'; // Solid orange for medium risk
    } else {
      return '#ff4444'; // Solid red for high risk
    }
  };

  const getRiskLabel = (riskLevel: number) => {
    if (riskLevel <= lowRiskThreshold) {
      return 'Low';
    } else if (riskLevel <= highRiskThreshold) {
      return 'Medium';
    } else {
      return 'High';
    }
  };

  useEffect(() => {
    fetchProfilesData();
  }, []);

  // Refresh when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      console.log('🔄 Refreshing data due to refresh key change:', refreshKey);
      fetchProfilesData();
    }
  }, [refreshKey]);

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

  const handleCalculateRiskForAll = async () => {
    console.log('🔘 Button clicked! Starting risk calculation...');
    
    // Add immediate debugging
    console.log('🔍 Checking if calculateRiskForAllUsers is available...');
    console.log('🔍 Function type: ' + typeof calculateRiskForAllUsers);
    console.log('🔍 Function name: ' + calculateRiskForAllUsers.name);
    
    // Run immediately without any alerts
    console.log('✅ Starting calculation immediately...');
    setCalculatingRisk(true);
    setCalculationProgress('Starting calculation...');
    try {
      console.log('📞 Calling calculateRiskForAllUsers()...');
      setCalculationProgress('Fetching users without risk levels...');
      
      // Add timeout and better error handling
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 30 seconds')), 30000)
      );
      
      const resultsPromise = calculateRiskForAllUsers(claudePrompt);
      console.log('📞 Function called, waiting for results...');
      const results = await Promise.race([resultsPromise, timeoutPromise]) as RiskCalculationResult[];
      
      console.log('📥 Received results: ' + JSON.stringify(results.length) + ' items');
      console.log('📥 First result: ' + JSON.stringify(results[0]));
      
      const successCount = results.filter((r: RiskCalculationResult) => r.success).length;
      const failureCount = results.filter((r: RiskCalculationResult) => !r.success).length;
      
      console.log(`📊 Summary: ${successCount} success, ${failureCount} failed`);
      setCalculationProgress(`Complete! ${successCount} success, ${failureCount} failed`);
      
      if (failureCount > 0) {
        console.log('❌ Failed results: ' + JSON.stringify(results.filter((r: RiskCalculationResult) => !r.success)));
      }
      
      // Refresh the data to show updated risk levels
      console.log('🔄 Refreshing data...');
      setCalculationProgress('Refreshing data...');
      await fetchProfilesData();
      console.log('✅ Data refresh complete');
      setCalculationProgress('');
    } catch (error) {
      console.log('❌ Error in handleCalculateRiskForAll: ' + String(error));
      console.log('❌ Error stack: ' + (error as Error).stack);
      setCalculationProgress('Error occurred: ' + String(error));
    } finally {
      console.log('🏁 Setting calculatingRisk to false');
      setCalculatingRisk(false);
    }
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, styles.nameCell]}>{item.full_name || 'N/A'}</Text>
      <View style={styles.riskCell}>
        {item.risk_level !== null ? (
          <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.risk_level) }]}>
            <Text style={styles.riskText}>{item.risk_level}</Text>
          </View>
        ) : (
          <Text style={styles.cell}>N/A</Text>
        )}
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
      <Text style={[styles.headerCell, styles.riskCell]}>Risk Level</Text>
    </View>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <ThemedText type="body" style={styles.emptyText}>No profiles found</ThemedText>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DesignTokens.colors['black-900']} />
        <ThemedText type="body" style={styles.loadingText}>Loading Profiles Data...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        User Risk Levels
      </ThemedText>
      
      {/* Risk Calculation Button */}
      <ThemedButton
        title={calculatingRisk 
          ? (calculationProgress || '🔄 Calculating...') 
          : '🔍 Calculate Risk for All Users'
        }
        variant="primary"
        onPress={handleCalculateRiskForAll}
        style={styles.calculateButton}
      />

      {/* Table */}
      <View style={styles.tableContainer}>
        <ListHeader />
        <ScrollView 
          style={styles.tableScrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchProfilesData}
              colors={[DesignTokens.colors['black-900']]}
            />
          }
        >
          {profiles.length === 0 ? (
            <EmptyList />
          ) : (
            profiles.map((profile, index) => (
              <View key={profile.id}>
                {renderItem({ item: profile })}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.cardProfessional,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: DesignTokens.colors['white-000'],
    fontSize: DesignTokens.typography.fontSize.h3,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
  },
  calculateButton: {
    marginBottom: 24,
  },
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
    backgroundColor: DesignTokens.colors['black-800'],
  },
  tableHeader: {
    ...CommonStyles.tableHeader,
  },
  tableRow: {
    ...CommonStyles.tableRow,
  },
  tableScrollView: {
    maxHeight: 400,
  },
  headerCell: {
    fontSize: DesignTokens.typography.fontSize.small,
    fontWeight: '600',
    color: DesignTokens.colors['gray-300'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cell: {
    fontSize: DesignTokens.typography.fontSize.body,
    color: DesignTokens.colors['gray-200'],
  },
  nameCell: {
    flex: 1,
  },
  riskCell: {
    width: 100,
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  riskText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    ...CommonStyles.cardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    color: DesignTokens.colors['gray-400'],
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: DesignTokens.colors['gray-400'],
  },
}); 