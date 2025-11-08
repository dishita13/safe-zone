// data/mockData.ts

/**
 * Utility function to calculate color based on completion score (0 to 5)
 * Used by both map and panel components.
 */
export const getColorByScore = (score: number): string => {
  const green = score * (255 / 5);
  const red = 255 - green;
  // Simple Red-to-Green transition
  return `rgba(${Math.round(red)}, ${Math.round(green)}, 0, 0.7)`;
};

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

interface Neighbor {
  id: string;
  completion: number;
  center: { latitude: number; longitude: number };
}

/**
 * The single property (polygon) and its associated fire risk tasks.
 * In a real app, this would be fetched based on the user's location/selection.
 */
export const MOCK_PROPERTY_DATA: Property = {
  id: 'parcel-12345',
  coordinates: [ // Example coordinates for a simple rectangle/area
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78855, longitude: -122.4314 },
    { latitude: 37.78755, longitude: -122.4304 },
    { latitude: 37.78725, longitude: -122.4318 },
  ],
  tasks: [
    { id: 1, text: "I've cleared my gutters.", completed: false },
    { id: 2, text: "I've mowed my dry grass (defensible space).", completed: false },
    { id: 3, text: "I've pruned low-hanging tree branches.", completed: false },
    { id: 4, text: "I've removed all combustibles near the house.", completed: false },
    { id: 5, text: "I've secured my emergency evacuation kit.", completed: false },
  ],
};

/**
 * Center the map on the mock property
 */
export const INITIAL_REGION = {
  latitude: 37.7879,
  longitude: -122.4314,
  latitudeDelta: 0.005, // Small delta for close zoom
  longitudeDelta: 0.005,
};

/**
 * Neighborhood Mock Data (Simplified to show the radius and neighboring scores)
 */
export const NEIGHBORHOOD_DATA: Neighbor[] = [
    { id: 'neighbor-A', completion: 3, center: { latitude: 37.7900, longitude: -122.4320 } },
    { id: 'neighbor-B', completion: 5, center: { latitude: 37.7860, longitude: -122.4330 } },
    { id: 'neighbor-C', completion: 1, center: { latitude: 37.7850, longitude: -122.4300 } },
    { id: 'neighbor-D', completion: 4, center: { latitude: 37.7890, longitude: -122.4340 } },
];
