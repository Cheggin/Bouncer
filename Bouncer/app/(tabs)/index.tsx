import { StyleSheet } from 'react-native';

import AuthDataTable from '@/components/AuthDataTable';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <AuthDataTable />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
