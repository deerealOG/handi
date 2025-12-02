# Google Maps Integration Setup

## Overview
The Explore screen now includes an interactive map view powered by `react-native-maps` that displays artisan locations with custom markers.

## Features
- ✅ Interactive map with Google Maps
- ✅ Custom markers for each artisan
- ✅ Tap markers to view artisan details
- ✅ Floating card showing selected artisan info
- ✅ Direct booking from map view
- ✅ Filters apply to map markers

## Setup Instructions

### 1. Get Google Maps API Key

#### For Android:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Maps SDK for Android**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the key to Android apps (recommended)
6. Copy the API key

#### For iOS:
1. In the same Google Cloud project
2. Enable **Maps SDK for iOS**
3. Create a new API key or use the same one
4. Restrict the key to iOS apps (recommended)
5. Copy the API key

### 2. Add API Keys to app.json

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `app.json` with your actual API keys:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_ACTUAL_IOS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ACTUAL_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

### 3. Rebuild the App

After adding the API keys, rebuild your app:

```bash
# For development build
npx expo prebuild --clean

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## Map Features

### Custom Markers
- Each artisan appears as a custom marker on the map
- Markers use the app's primary color
- Tap any marker to select that artisan

### Artisan Card
- Shows selected artisan's photo, name, skill, rating, and distance
- "Book" button navigates directly to the booking screen
- Card updates when you tap different markers

### Filtering
- Category filters apply to map markers
- Search functionality filters visible markers
- Only matching artisans appear on the map

## Coordinates

Current artisan locations are set around Lagos, Nigeria:
- Center: 6.5244°N, 3.3792°E
- You can update coordinates in `app/client/(tabs)/explore.tsx`

## Troubleshooting

### Map not showing?
1. Verify API keys are correct in `app.json`
2. Ensure billing is enabled in Google Cloud Console
3. Check that Maps SDK is enabled for your platform
4. Rebuild the app after adding API keys

### Markers not appearing?
1. Check that artisan data includes `latitude` and `longitude`
2. Verify coordinates are within the map's visible region
3. Check console for any errors

## Future Enhancements
- User location tracking
- Route directions to artisan
- Clustering for many markers
- Custom map styles
- Real-time artisan locations
