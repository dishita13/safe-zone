// components/ChecklistPanel.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Property {
  id: string;
  coordinates: { latitude: number; longitude: number }[];
  tasks: Task[];
}

interface ChecklistPanelProps {
  property: Property;
  toggleTask: (taskId: number) => void;
  neighborhoodScore: number;
  userScore: number;
}

export default function ChecklistPanel({ 
    property, 
    toggleTask, 
    neighborhoodScore,
    userScore,
}: ChecklistPanelProps) {
  return (
    <View style={styles.infoPanel}>
      <Text style={styles.scoreText}>
        Your Score: {userScore} / 5
      </Text>
      <Text style={styles.scoreText}>
         Our Neighborhood Resilience Score (5 mi): {neighborhoodScore} / 5
      </Text>
      
      <View style={styles.checklist}>
        <Text style={styles.checklistTitle}>🔥 Fire Mitigation Checklist</Text>
        {property.tasks.map(task => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskItem} 
            onPress={() => toggleTask(task.id)}
          >
            <Text style={styles.taskText}>
              {task.completed ? '✅' : '⬜'} {task.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoPanel: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  checklist: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  taskItem: {
    paddingVertical: 5,
  },
  taskText: {
    fontSize: 15,
  }
});
