// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure that .json and .geojson files are bundled properly
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'json',
  'geojson',
];

module.exports = config;
