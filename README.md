# nostr-universe

Spring - The Nostr Browser.

To build the apk:

- Install JRE 11 or higher.
- Install latest Android Studio
- Install Android SDK Tools 33.0.2 (SDK Manager -> SDK Tools -> check Show package details -> Select 33.0.2)
- Then:

```
cd app
npm i
npx run build
cd ../universe
cordova plugin add https://github.com/nostrband/nostr-keystore-cordova-plugin
cordova plugin add https://github.com/nostrband/cordova-plugin-inappbrowser
cordova plugin add https://github.com/nostrband/nostr-walletstore-cordova-plugin/tree/without-nostr-utils
cordova plugin add cordova-clipboard
cordova plugin add cordova-plugin-x-socialsharing
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-native-logs
cordova plugin add cordova-plugin-androidx-adapter
cordova plugin add https://github.com/nostrband/cordova-plugin-local-notifications
cordova plugin add https://github.com/nostrband/cordova-plugin-intent
cordova platform add android
cordova build android
```

apk file will be at platforms/android/app/build/outputs/apk/debug/app-debug.apk

To run in the emulator, install a virtual device with API version 31 or higher.