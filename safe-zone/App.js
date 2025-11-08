// App.js

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FireResilienceMap from '../components/FireResilienceMap';
import ChecklistPanel from '../components/ChecklistPanel';
import { MOCK_PROPERTY_DATA, NEIGHBORHOOD_DATA } from './data/mockData';

export default function App() {
  const [property, setProperty] = useState(MOCK_PROPERTY_DATA);
  // selectedParcel state is retained but used minimally in this version 
  // since only one parcel is currently loaded.
  const [selectedParcel, setSelectedParcel] = useState(MOCK_PROPERTY_DATA.id); 

  // Calculate the user's score
  const userScore = property.tasks.filter(t => t.completed).length;

  // Calculate the Neighborhood Resilience Score
  const totalParcels = NEIGHBORHOOD_DATA.length + 1; // Neighbors + User
  const totalScore = NEIGHBORHOOD_DATA.reduce((sum, n) => sum + n.completion, userScore);
  const neighborhoodScore = Math.round(totalScore / totalParcels);

  const toggleTask = (taskId) => {
    setProperty(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };
  
  // Placeholder function for when a parcel is tapped (optional for this prototype)
  const handleParcelTap = (parcelId) => {
      setSelectedParcel(parcelId);
      // In a real app, this would fetch that parcel's details/score
  };

  return (
    <View style={styles.container}>
      <FireResilienceMap
        property={property}
        onParcelTap={handleParcelTap}
      />
      
      {/* The checklist panel is always visible in this simple version */}
      {selectedParcel === property.id && (
        <ChecklistPanel
          property={property}
          toggleTask={toggleTask}
          userScore={userScore}
          neighborhoodScore={neighborhoodScore}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40, // To avoid status bar overlap in a standalone Expo app
  },
});