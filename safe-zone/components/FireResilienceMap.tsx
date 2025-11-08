// components/FireResilienceMap.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polygon, Marker, Circle } from 'react-native-maps';
import { INITIAL_REGION, getColorByScore, NEIGHBORHOOD_DATA } from '../data/mockData';

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

interface FireResilienceMapProps {
  property: Property;
  onParcelTap: (parcelId: string) => void;
}

export default function FireResilienceMap({ property, onParcelTap }: FireResilienceMapProps) {
  const score = property.tasks.filter(t => t.completed).length;
  const fillColor = getColorByScore(score);

  return (
    <View style={styles.mapContainer}>
      <MapView
        initialRegion={INITIAL_REGION}
        style={styles.map}
        // Setting onPress to null to prevent map tap from deselecting in this version
      >
        {/* 1. User's Property (Colored Polygon) */}
        <Polygon
          key={property.id}
          coordinates={property.coordinates}
          strokeColor="#000"
          strokeWidth={2}
          fillColor={fillColor}
          tappable={true}
          onPress={() => onParcelTap(property.id)}
        />
        
        {/* Marker for the center of the user's property */}
        <Marker 
          coordinate={{ latitude: INITIAL_REGION.latitude, longitude: INITIAL_REGION.longitude }} 
          title="Your Property"
          pinColor="blue"
        />

        {/* 2. 5-mile Radius Overlay */}
        <Circle
            center={{ latitude: INITIAL_REGION.latitude, longitude: INITIAL_REGION.longitude }}
            radius={8046.7} // ~5 miles in meters
            strokeWidth={1}
            strokeColor={'rgba(0, 0, 255, 0.5)'}
            fillColor={'rgba(0, 0, 255, 0.05)'}
        />
        
        {/* 3. Neighborhood Indicators (Simplified circles for neighbors) */}
        {NEIGHBORHOOD_DATA.map(neighbor => (
            <Circle
                key={neighbor.id}
                center={neighbor.center}
                radius={20} // Tiny circle to represent a neighbor's parcel
                fillColor={getColorByScore(neighbor.completion)}
                strokeColor="transparent"
            />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 2,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
