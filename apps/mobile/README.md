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
