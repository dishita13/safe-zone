// app/map.tsx — screen to display the FireRiskMap component

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Import the Earth Engine map component instead of the old FireRiskMap
import FireMapEe from '../../components/FireRiskMap';

// Define the screen component
const MapScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Render the Earth Engine map */}
      <FireMapEe />
    </SafeAreaView>
  );
};

// Define simple styling for the screen container
const styles = StyleSheet.create({
  container: {
    flex: 1,            // Fill entire screen
    backgroundColor: '#fff',
  },
});

export default MapScreen;
