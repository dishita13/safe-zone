import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const BACKEND_URL = 'http://10.0.0.137:8080'; // e.g. http://192.168.1.100:5000

const makeHtml = (tileUrl: string) => `<!doctype html>
<html>
<head>
  <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  <style>html,body,#map{height:100%;margin:0;padding:0}</style>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
</head>
<body>
<p>${tileUrl}</p>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    (function() {
      var map = L.map('map').setView([47.295, -119.086], 6);
      L.tileLayer('${tileUrl}', {
        maxZoom: 12,
        attribution: 'Earth Engine FIRMS (2018-08-01 → 2018-08-10)'
      }).addTo(map);
    })();
  </script>
</body>
</html>`;

const FireMapEe: React.FC = () => {
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/tile-url`);
        const body = await res.json();
        if (!res.ok || body.error) {
          throw new Error(body.error || 'Failed to get tile URL');
        }
        setTileUrl(body.tile_url);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading map tiles...</Text>
      </View>
    );
  }

  if (error || !tileUrl) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', textAlign: 'center', padding: 12 }}>
          Error loading Earth Engine tiles: {error || 'no tile URL'}
        </Text>
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: makeHtml(tileUrl) }}
      style={{ flex: 1 }}
      startInLoadingState
      scalesPageToFit
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default FireMapEe;