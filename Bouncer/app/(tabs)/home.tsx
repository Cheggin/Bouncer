import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';

import AuthDataTable from '@/components/AuthDataTable';
import RiskAlertScanner from '@/components/RiskAlertScanner';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <RiskAlertScanner />
        <AuthDataTable />
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