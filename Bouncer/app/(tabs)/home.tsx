import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import { useState } from 'react';

import AuthDataTable from '@/components/AuthDataTable';
import RiskAlertScanner from '@/components/RiskAlertScanner';
import RiskPromptBox from '@/components/RiskPromptBox';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [lowThreshold, setLowThreshold] = useState(33);
  const [highThreshold, setHighThreshold] = useState(66);

  const handleRiskScoreGenerated = (prompt: string, riskScore: number) => {
    console.log('🎯 Risk score generated:', { prompt, riskScore });
    // You can add additional logic here to handle the generated risk score
    // For example, save it to your database or trigger other actions
  };

  const handleThresholdsChange = (low: number, high: number) => {
    setLowThreshold(low);
    setHighThreshold(high);
    console.log('📊 Thresholds updated:', { low, high });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <RiskPromptBox 
          onRiskScoreGenerated={handleRiskScoreGenerated}
          onThresholdsChange={handleThresholdsChange}
          initialLowThreshold={lowThreshold}
          initialHighThreshold={highThreshold}
        />
        <RiskAlertScanner 
          highRiskThreshold={highThreshold}
        />
        <AuthDataTable 
          lowRiskThreshold={lowThreshold}
          highRiskThreshold={highThreshold}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}); 