import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from 'react-native-maps';

// 🔹 This component renders a map centered on the user’s location and shows nearby fire risk polygons.
const FireRiskMap: React.FC = () => {
  // React state for loading UI and dynamic map region
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<any[]>([]);

  // lifecycle / debug logs
  useEffect(() => {
    console.log('[FireRiskMap] mounted');
    return () => console.log('[FireRiskMap] unmounted');
  }, []);

  useEffect(() => {
    console.log('[FireRiskMap] loading:', loading);
  }, [loading]);

  useEffect(() => {
    if (region) console.log('[FireRiskMap] region set:', region);
  }, [region]);

  // Helper function to calculate the distance (in miles) between two coordinates
  const distanceMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Load GeoJSON file dynamically from assets folder and filter by proximity
  const loadNearbyFeatures = async (lat: number, lon: number) => {
    console.log('[FireRiskMap] loadNearbyFeatures: start');
    try {
      console.log('[FireRiskMap] loading geojson via bundle (require/import)');
      // Metro bundles JSON — require() returns the parsed object.
      // Use require/import instead of Asset.fromModule for JSON files.
      // If you prefer TS imports, enable "resolveJsonModule" and use: import geojson from '../assets/data/fire-risk.json'
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const geojson = require('../assets/data/fire-risk.json') as any;
      if (!geojson || !Array.isArray(geojson.features)) {
        throw new Error('GeoJSON missing or malformed');
      }
      console.log('[FireRiskMap] geojson loaded, feature count:', (geojson.features || []).length);

      // Filter polygons within 20 miles of the user’s location
      const filtered = geojson.features.filter((feature: any) => {
        const coords = feature.geometry.coordinates[0];
        const [lon0, lat0] = coords[0];
        const dist = distanceMiles(lat, lon, lat0, lon0);
        return dist <= 20;
      });

      console.log('[FireRiskMap] filtered features within 20 miles:', filtered.length);
      setVisibleFeatures(filtered);
      setLoading(false);
    } catch (err) {
      console.error('[FireRiskMap] Error loading GeoJSON:', err);
      Alert.alert('Error', 'Failed to load fire risk data.');
      setLoading(false);
    }
  };

  // Get user location on first mount
  useEffect(() => {
    (async () => {
      try {
        console.log('[FireRiskMap] requesting location permission');
        // Request foreground location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('[FireRiskMap] permission denied');
          Alert.alert(
            'Permission denied',
            'We need location access to show nearby fire risk areas.'
          );
          setLoading(false);
          return;
        }
        console.log('[FireRiskMap] permission granted');

        // Attempt to get location with a timeout (8 seconds).
        // Promise.race can return different types, so narrow it explicitly to the
        // expected Location.LocationObject before accessing `.coords` to satisfy TS.
        console.log('[FireRiskMap] getting current position (8s timeout)');
        const raceResult = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Location timeout')), 8000)
          ),
        ]);

        // Cast the race result to the known Location type (or null). We then
        // guard against missing coords before destructuring to avoid TS errors.
        const position = raceResult as Location.LocationObject | null;

        if (!position || !position.coords) throw new Error('No coordinates found');

        console.log('[FireRiskMap] position obtained:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        const { latitude, longitude } = position.coords;

        // Define initial map region (zoomed in to ~20 miles)
        const delta = 0.3; // smaller delta = closer zoom
        setRegion({
          latitude,
          longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        });

        // Load only nearby polygons
        loadNearbyFeatures(latitude, longitude);
      } catch (error: any) {
        console.error('[FireRiskMap] Location error:', error);
        Alert.alert(
          'Location Error',
          'Unable to get your location. Please enable GPS and restart the app.'
        );
        setLoading(false);
      }
    })();
  }, []);

  // Render the map
  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={region}
      onMapReady={() => console.log('[FireRiskMap] MapView ready')}
      showsUserLocation
      showsMyLocationButton
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
    >
      {/* Render visible fire risk polygons */}
      {visibleFeatures.map((feature, index) => {
        const coords = feature.geometry.coordinates[0].map(
          (pair: [number, number]) => ({
            latitude: pair[1],
            longitude: pair[0],
          })
        );

        return (
          <Polygon
            key={index}
            coordinates={coords}
            strokeColor="#D32F2F"
            fillColor="rgba(244, 67, 54, 0.3)"
            strokeWidth={2}
          />
        );
      })}
    </MapView>
  );
};

// Basic styling
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FireRiskMap;
