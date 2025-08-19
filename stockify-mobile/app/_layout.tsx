import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { dbManager } from '@/services/db';
import { AppProvider } from '@/contexts/AppContext';
import '../global.css';

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS !== 'web') {
          await dbManager.init(); // inicializa SQLite apenas no mobile
        }
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    }
    prepare();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao inicializar banco de dados:</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Inicializando banco de dados...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return <AppContent />;
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { fontSize: 16, color: '#64748B' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 20 },
  errorText: { fontSize: 18, color: '#DC2626', fontWeight: '600', marginBottom: 8 },
  errorMessage: { fontSize: 14, color: '#7F1D1D', textAlign: 'center' },
});
