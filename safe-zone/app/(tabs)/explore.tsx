import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ChecklistPanel from '@/components/ChecklistPanel';
import { useProperty } from '@/contexts/PropertyContext';
import { NEIGHBORHOOD_DATA } from '@/data/mockData';

export default function ChecklistScreen() {
  const { property, toggleTask, userScore } = useProperty();
  
  // Calculate average neighborhood score
  const neighborhoodScore = Math.round(
    NEIGHBORHOOD_DATA.reduce((sum, neighbor) => sum + neighbor.completion, 0) / NEIGHBORHOOD_DATA.length
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Fire Safety Checklist</ThemedText>
      </ThemedView>
      <ChecklistPanel
        property={property}
        toggleTask={toggleTask}
        neighborhoodScore={neighborhoodScore}
        userScore={userScore}
      />
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
  },
});
