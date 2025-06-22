import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AuthDataTable from '@/components/AuthDataTable';
import RiskAlertScanner from '@/components/RiskAlertScanner';
import RiskPromptBox from '@/components/RiskPromptBox';
import DebugLogger from '@/components/DebugLogger';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { DesignTokens } from '@/constants/Colors';

export default function HomeScreen() {
  const [lowThreshold, setLowThreshold] = useState(33);
  const [highThreshold, setHighThreshold] = useState(66);
  const [claudePrompt, setClaudePrompt] = useState('You are a risk assessment AI analyzing user data for potential security threats. Analyze the following user information and provide a risk score from 0-100.');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThresholdsChange = (low: number, high: number) => {
    setLowThreshold(low);
    setHighThreshold(high);
    console.log('📊 Thresholds updated:', { low, high });
  };

  const handlePromptChange = (prompt: string) => {
    setClaudePrompt(prompt);
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered from header');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Vertical Split Container */}
      <View style={styles.splitContainer}>
        {/* Main Content Area - Left Half */}
        <View style={styles.mainContent}>
          {/* Fixed Header */}
          <LinearGradient
            colors={[DesignTokens.colors['black-900'], DesignTokens.colors['black-800']]}
            style={styles.fixedHeader}
          >
            <View style={styles.headerContent}>
              <ThemedText type="h2" style={styles.headerTitle}>
                Risk Assessment Dashboard
              </ThemedText>
              <ThemedText type="small" style={styles.headerSubtitle}>
                Real-time security monitoring
              </ThemedText>
            </View>
            
            {/* Refresh Button */}
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="refresh" 
                size={20} 
                color={DesignTokens.colors['white-000']} 
              />
            </TouchableOpacity>
          </LinearGradient>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Risk Analysis Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="h3" style={styles.sectionTitle}>
                  Risk Analysis
                </ThemedText>
                <ThemedText type="small" style={styles.sectionDescription}>
                  Configure Claude prompt and risk assessment thresholds
                </ThemedText>
              </View>
              <RiskPromptBox 
                onThresholdsChange={handleThresholdsChange}
                onPromptChange={handlePromptChange}
                initialLowThreshold={lowThreshold}
                initialHighThreshold={highThreshold}
              />
            </View>

            {/* Data Overview Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="h3" style={styles.sectionTitle}>
                  Data Overview
                </ThemedText>
                <ThemedText type="small" style={styles.sectionDescription}>
                  Authentication data and risk scores
                </ThemedText>
              </View>
              <AuthDataTable 
                lowRiskThreshold={lowThreshold}
                highRiskThreshold={highThreshold}
                claudePrompt={claudePrompt}
                refreshKey={refreshKey}
              />
            </View>

            {/* Alert Monitoring Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="h3" style={styles.sectionTitle}>
                  Alert Monitoring
                </ThemedText>
                <ThemedText type="small" style={styles.sectionDescription}>
                  Real-time risk alerts and notifications
                </ThemedText>
              </View>
              <RiskAlertScanner 
                highRiskThreshold={highThreshold}
              />
            </View>

            {/* Bottom spacing for better scroll experience */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>

        {/* Debug Logger - Right Half */}
        <DebugLogger maxLogs={50} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors['gray-900'],
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row', // This creates the vertical split (left/right)
  },
  mainContent: {
    flex: 1,
    width: '50%', // Left half of the screen
  },
  fixedHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16, // Reduced padding for narrower space
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors['gray-700'],
    ...DesignTokens.shadows.subtle,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
  },
  refreshButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DesignTokens.colors['gray-700'],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DesignTokens.colors['gray-600'],
  },
  headerTitle: {
    color: DesignTokens.colors['white-000'],
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 20, // Slightly smaller for split view
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    color: DesignTokens.colors['gray-300'],
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 12, // Smaller for split view
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24, // Reduced spacing for split view
    paddingHorizontal: 16, // Reduced padding for narrower space
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: DesignTokens.colors['white-000'],
    marginBottom: 4,
    fontSize: 18, // Slightly smaller for split view
  },
  sectionDescription: {
    color: DesignTokens.colors['gray-400'],
    opacity: 0.9,
    fontSize: 12, // Smaller for split view
  },
  bottomSpacer: {
    height: 20,
  },
}); 