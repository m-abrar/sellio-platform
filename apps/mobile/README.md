# Sellio React Native Mobile App

The buyer-first mobile app uses Expo and reads its Laravel API base URL from
`EXPO_PUBLIC_API_URL`. Copy `.env.example` to `.env`, then choose the URL for the
device running the app.

## API URL examples

| Runtime | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Android emulator | `http://10.0.2.2:8000/api` |
| iOS simulator | `http://127.0.0.1:8000/api` |
| Expo web | `http://127.0.0.1:8000/api` |
| Physical phone | `http://YOUR_COMPUTER_LAN_IP:8000/api` |
| Staging | `https://staging.example.com/api` |
| Production | `https://example.com/api` |

For a physical phone, connect the phone and development computer to the same
network, use the computer's current IPv4 address, allow Laravel through the
Windows firewall, and bind Laravel to the network:

```powershell
php artisan serve --host=0.0.0.0 --port=8000
```

Restart Expo after changing `.env` so the new public environment variable is
included in the bundle:

```powershell
npm.cmd start -- --clear
```

Use HTTPS URLs for staging and production. Android cleartext HTTP is enabled in
development for LAN testing and should not be relied on for production traffic.

## Install and run

```powershell
cd apps/mobile
npm.cmd install
npm.cmd test
npx.cmd tsc --noEmit
npm.cmd start
```

Open the QR code in Expo Go for JavaScript-only development. Push notifications
and native notification handling require an EAS development or preview build.

## Realtime messaging

Set `EXPO_PUBLIC_PUSHER_APP_KEY` and `EXPO_PUBLIC_PUSHER_APP_CLUSTER` to the same
values used by Laravel. Laravel must expose `/api/broadcasting/auth` and use the
`pusher` broadcast connection. Without these values, the inbox remains fully
usable through REST and reports realtime as disabled.

## Deep links and checkout

The app uses the `sellio` URL scheme. Supported routes include listing links,
password reset links, and `sellio://payment-return`. Product checkout requests a
five-minute signed handoff from Laravel, opens the existing Stripe/PayPal web
checkout, then verifies the returned order through the authenticated API.

## EAS builds

Install and authenticate the EAS CLI, then initialize the Expo project once so
Expo writes the real `extra.eas.projectId` value to `app.json`:

```powershell
npm.cmd install --global eas-cli
eas login
eas init
```

Build profiles are defined in `eas.json`:

```powershell
eas build --platform android --profile development
eas build --platform android --profile preview
eas build --platform android --profile production
eas build --platform ios --profile production
```

The preview Android profile produces an installable APK. Production Android
produces an App Bundle. iOS signing and archive generation require an Apple
Developer account and must be completed through EAS or on macOS before mobile
support is advertised.

## Release checklist

1. Use HTTPS API and storefront URLs.
2. Configure the EAS project ID and Pusher environment values.
3. Apply backend migrations, including `push_tokens`.
4. Verify login, discovery, favorites, messaging, notifications, and checkout on
   a physical Android device and an iOS build.
5. Run `npm.cmd test` and `npx.cmd tsc --noEmit`.
6. Produce signed Android and iOS artifacts and verify payment return links.

## End-to-end smoke flows

Maestro flows live under `.maestro/` and cover login, discovery/favorites,
messaging, and checkout handoff. With a development build installed:

```powershell
$env:BUYER_EMAIL="buyer@sellio.buzz"
$env:BUYER_PASSWORD="your-password"
maestro test .maestro
```
