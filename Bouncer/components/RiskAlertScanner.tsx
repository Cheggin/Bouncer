import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ThemedButton } from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DesignTokens } from '@/constants/Colors';
import { CommonStyles } from '@/constants/Styles';

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  risk_level?: number;
  created_at: string;
}

interface ScanResult {
  user: Profile;
  emailSent: boolean;
  error?: string;
}

interface RiskAlertScannerProps {
  highRiskThreshold?: number;
}

export default function RiskAlertScanner({ highRiskThreshold = 66 }: RiskAlertScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [highRiskCount, setHighRiskCount] = useState(0);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Function to send email alert
  const sendEmailAlert = async (profile: Profile): Promise<boolean> => {
    try {
      console.log(`📤 Sending request for user: ${profile.full_name} (Risk: ${profile.risk_level})`);
      console.log(`🎯 Using threshold: ${highRiskThreshold} (User risk: ${profile.risk_level})`);
      
      const response = await fetch('https://frwuwtdnzrvluqaubvnn.supabase.co/functions/v1/risk-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          record: profile,
          highRiskThreshold: highRiskThreshold
        })
      });

      console.log(`📊 Response status: ${response.status}`);
      
      const responseText = await response.text();
      console.log(`📝 Raw response: ${responseText}`);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Failed to parse response as JSON:', responseText);
        return false;
      }

      if (response.ok && responseData.success) {
        console.log(`✅ Email sent for user: ${profile.full_name} (Risk: ${profile.risk_level})`);
        return true;
      } else {
        console.error(`❌ Email failed for user: ${profile.full_name}`, responseData);
        return false;
      }
    } catch (error) {
      console.error(`❌ Email error for user: ${profile.full_name}`, error);
      return false;
    }
  };

  // Function to scan database for high-risk users
  const scanForHighRiskUsers = async () => {
    setScanning(true);
    setResults([]);

    try {
      console.log(`🔍 Scanning database for users with risk level > ${highRiskThreshold}...`);

      // Fetch all profiles with risk_level > highRiskThreshold
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .gt('risk_level', highRiskThreshold)
        .order('risk_level', { ascending: false });

      if (error) {
        console.error('❌ Error fetching profiles:', error);
        Alert.alert('Error', 'Failed to fetch profiles from database');
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('ℹ️ No high-risk users found');
        setHighRiskCount(0);
        setLastScanTime(new Date());
        return;
      }

      console.log(`📊 Found ${profiles.length} high-risk users`);
      setHighRiskCount(profiles.length);

      // Process each high-risk user
      const scanResults: ScanResult[] = [];
      
      for (const profile of profiles) {
        console.log(`📧 Processing user: ${profile.full_name} (Risk: ${profile.risk_level})`);
        
        const emailSent = await sendEmailAlert(profile);
        
        scanResults.push({
          user: profile,
          emailSent,
          error: emailSent ? undefined : 'Failed to send email'
        });

        // Small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResults(scanResults);
      setLastScanTime(new Date());

      // Show summary
      const successCount = scanResults.filter(r => r.emailSent).length;
      const failureCount = scanResults.filter(r => !r.emailSent).length;
      
      console.log(`✅ Scan complete: ${successCount} emails sent, ${failureCount} failed`);
      
      Alert.alert(
        'Scan Complete', 
        `Found ${profiles.length} high-risk users\n${successCount} emails sent\n${failureCount} failed`
      );

    } catch (error) {
      console.error('❌ Scan error:', error);
      Alert.alert('Error', 'Failed to complete scan');
    } finally {
      setScanning(false);
    }
  };

  // Auto-scan on component mount (optional)
  useEffect(() => {
    // Uncomment the next line if you want auto-scan on mount
    // scanForHighRiskUsers();
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        Risk Alert Scanner
      </ThemedText>
      
      <View style={styles.descriptionContainer}>
        <ThemedText type="body" style={styles.description}>
          Scan the database for users with risk level {'> '} 
        </ThemedText>
        <ThemedText type="body" style={[styles.description, styles.highRiskThreshold]}>
          {highRiskThreshold}
        </ThemedText>
        <ThemedText type="body" style={styles.description}>
          {' '}and send email alerts.
        </ThemedText>
      </View>

      {/* Scan Button */}
      <ThemedButton
        title={scanning ? '🔍 Scanning...' : '🔍 Scan for High-Risk Users'}
        variant="primary"
        onPress={scanning ? undefined : scanForHighRiskUsers}
        style={styles.scanButton}
      />

      {/* Status Information */}
      {lastScanTime && (
        <ThemedText type="small" style={styles.statusText}>
          Last scan: {lastScanTime.toLocaleString()}
        </ThemedText>
      )}

      {highRiskCount > 0 && (
        <ThemedText type="small" style={styles.statusText}>
          High-risk users found: {highRiskCount}
        </ThemedText>
      )}

      {/* Results */}
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <ThemedText type="h3" style={styles.resultsTitle}>
            Scan Results
          </ThemedText>
          
          <ScrollView style={styles.resultsList}>
            {results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <ThemedText type="body" style={styles.userName}>
                  {result.user.full_name || 'Unknown User'}
                </ThemedText>
                <ThemedText type="small" style={styles.userEmail}>
                  {result.user.email}
                </ThemedText>
                <View style={styles.resultStatus}>
                  <ThemedText type="small" style={[
                    styles.statusBadge,
                    result.emailSent ? styles.successBadge : styles.errorBadge
                  ]}>
                    {result.emailSent ? '✅ Sent' : '❌ Failed'}
                  </ThemedText>
                  <ThemedText type="small" style={styles.riskLevel}>
                    Risk: {result.user.risk_level}
                  </ThemedText>
                </View>
                {result.error && (
                  <ThemedText type="small" style={styles.errorText}>
                    {result.error}
                  </ThemedText>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.cardProfessional,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    color: DesignTokens.colors['white-000'],
    fontSize: DesignTokens.typography.fontSize.h3,
    fontFamily: DesignTokens.typography.fontFamily.semiBold,
  },
  descriptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  description: {
    textAlign: 'center',
    color: DesignTokens.colors['gray-400'],
    lineHeight: 22,
  },
  highRiskThreshold: {
    color: '#ff4444', // Same red color as the high risk zone in the slider
    fontWeight: '600',
  },
  scanButton: {
    marginBottom: 20,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 8,
    color: DesignTokens.colors['gray-400'],
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    marginBottom: 16,
    color: DesignTokens.colors['gray-200'],
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    backgroundColor: DesignTokens.colors['gray-800'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
    marginBottom: 12,
    padding: 16,
  },
  userName: {
    fontWeight: '600',
    marginBottom: 4,
    color: DesignTokens.colors['gray-200'],
  },
  userEmail: {
    marginBottom: 8,
    color: DesignTokens.colors['gray-400'],
  },
  resultStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  successBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: DesignTokens.colors['success'],
  },
  errorBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: DesignTokens.colors['error'],
  },
  riskLevel: {
    color: DesignTokens.colors['gray-400'],
    fontWeight: '600',
  },
  errorText: {
    color: DesignTokens.colors['error'],
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 