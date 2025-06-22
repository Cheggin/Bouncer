import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
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
}

export default function AuthDataTable({ 
  lowRiskThreshold = 33, 
  highRiskThreshold = 66 
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
      
      const resultsPromise = calculateRiskForAllUsers();
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
      
      {/* Risk Calculation Button */}
      <TouchableOpacity 
        style={[styles.calculateButton, { backgroundColor: tintColor }]}
        onPress={handleCalculateRiskForAll}
        disabled={calculatingRisk}
      >
        <ThemedText style={[styles.calculateButtonText, { color: backgroundColor }]}>
          {calculatingRisk 
            ? (calculationProgress || '🔄 Calculating...') 
            : '🔍 Calculate Risk for All Users'
          }
        </ThemedText>
      </TouchableOpacity>

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
            <Text style={[styles.headerCell, { flex: 0.7, color: textColor }]}>Name</Text>
            <Text style={[styles.headerCell, styles.riskCell, { flex: 0.3, color: textColor }]}>Risk Level</Text>
          </View>

          {/* Table Body */}
          {profiles.map((profile) => (
            <View key={profile.id}>
              <View 
                style={[
                  styles.tableRow, 
                  { borderBottomColor: borderColor }
                ]}
              >
                <Text style={[styles.cell, { flex: 0.7, color: textColor }]}>{profile.full_name || 'N/A'}</Text>
                <Text 
                  style={[
                    styles.cell, 
                    styles.riskCell, 
                    { 
                      flex: 0.3,
                      color: profile.risk_level !== null ? getRiskColor(profile.risk_level) : textColor,
                      fontWeight: 'bold'
                    }
                  ]}
                >
                  {profile.risk_level ?? 'N/A'}
                </Text>
              </View>
              
              {/* Risk Analysis Details (if available) */}
              {profile.risk_analysis && (
                <View style={[styles.analysisRow, { borderBottomColor: borderColor }]}>
                  <Text style={[styles.analysisText, { color: textColor }]}>
                    <Text style={{ fontWeight: 'bold' }}>Analysis:</Text> {profile.risk_analysis}
                  </Text>
                  {profile.risk_factors && profile.risk_factors.length > 0 && (
                    <Text style={[styles.factorsText, { color: textColor }]}>
                      <Text style={{ fontWeight: 'bold' }}>Risk Factors:</Text> {profile.risk_factors.join(', ')}
                    </Text>
                  )}
                </View>
              )}
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
    // flex is now set inline
  },
  riskCell: {
    // flex is now set inline
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
  calculateButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analysisRow: {
    padding: 12,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  analysisText: {
    fontSize: 14,
    marginBottom: 4,
  },
  factorsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  debugContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugScrollView: {
    flex: 1,
  },
  debugLog: {
    marginBottom: 4,
  },
}); 