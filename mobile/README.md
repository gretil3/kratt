# Kratt — mobile app

React Native (Expo) app: paste a YouTube link, get a bot% score with a breakdown.

## Setup

```bash
npm install
```

## Run

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.

## Structure

- `app/` — screens and components (Expo Router file-based routing)

Calls the backend per [`../docs/api-contract.md`](../docs/api-contract.md). Set the backend base URL in a local config/env before running against a deployed backend.
