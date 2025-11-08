import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FireResilienceMap from '@/components/FireResilienceMap';
import { useProperty } from '@/contexts/PropertyContext';

export default function MapsScreen() {
  const { property } = useProperty();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Maps</ThemedText>
        <ThemedText type="subtitle">Fire Resilience Overview</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1,
  },
});
