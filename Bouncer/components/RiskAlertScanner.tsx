import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

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

export default function RiskAlertScanner() {
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
      
      const response = await fetch('https://frwuwtdnzrvluqaubvnn.supabase.co/functions/v1/risk-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          record: profile
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
      console.log('🔍 Scanning database for high-risk users...');

      // Fetch all profiles with risk_level > 50
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .gt('risk_level', 50)
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
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Risk Alert Scanner
      </ThemedText>
      
      <ThemedText style={styles.description}>
        Scan the database for users with risk level > 50 and send email alerts.
      </ThemedText>

      {/* Scan Button */}
      <View style={[styles.button, { backgroundColor: tintColor }]}>
        <ThemedText 
          style={[styles.buttonText, { color: 'white' }]}
          onPress={scanning ? undefined : scanForHighRiskUsers}
        >
          {scanning ? '🔍 Scanning...' : '🔍 Scan for High-Risk Users'}
        </ThemedText>
      </View>

      {/* Status Information */}
      {lastScanTime && (
        <ThemedText style={styles.statusText}>
          Last scan: {lastScanTime.toLocaleString()}
        </ThemedText>
      )}

      {highRiskCount > 0 && (
        <ThemedText style={styles.statusText}>
          High-risk users found: {highRiskCount}
        </ThemedText>
      )}

      {/* Results */}
      {results.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          <ThemedText type="subtitle" style={styles.resultsTitle}>
            Scan Results
          </ThemedText>
          
          {results.map((result, index) => (
            <View key={index} style={[styles.resultItem, { borderColor: tintColor }]}>
              <ThemedText style={styles.userName}>
                {result.user.full_name || 'Unknown User'}
              </ThemedText>
              <ThemedText style={styles.userDetails}>
                Risk Level: {result.user.risk_level}
              </ThemedText>
              <ThemedText style={styles.userDetails}>
                Email: {result.user.email || 'No email'}
              </ThemedText>
              <ThemedText 
                style={[
                  styles.status, 
                  { color: result.emailSent ? '#44aa44' : '#ff4444' }
                ]}
              >
                {result.emailSent ? '✅ Email Sent' : '❌ Email Failed'}
              </ThemedText>
              {result.error && (
                <ThemedText style={styles.errorText}>
                  Error: {result.error}
                </ThemedText>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 16,
  },
  resultsTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  resultItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    marginBottom: 2,
    opacity: 0.8,
  },
  status: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 2,
    fontStyle: 'italic',
  },
}); 