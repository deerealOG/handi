# Google Maps Setup

To enable Google Maps in the application, you need to obtain a Google Maps API Key.

## Steps

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Maps SDK for Android** and **Maps SDK for iOS**.
4. Create an API Key in the **Credentials** section.
5. (Optional but recommended) Restrict the API key to your Android and iOS apps.

## Configuration

Open `app.json` and replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key in both `ios.config.googleMapsApiKey` and `android.config.googleMaps.apiKey`.

```json
{
  "expo": {
    ...
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_ACTUAL_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ACTUAL_API_KEY"
        }
      }
    }
    ...
  }
}
```

## Rebuild

After adding the key, rebuild the native directories:

```bash
npx expo prebuild --clean
```
