# myore

`myore` is an unofficial, community-made open-source alternative client for the ORE protocol.

## MVP included in this repository

- 25 stable numbered mining tiles (1-25) with play-mode select + deploy flow
- Clear selected/deployed/winner/loser visual overlays
- Ore.supply-inspired dense app shell: top nav, left shared chat rail, compact board center, right control panel
- Side panels for round info, winner history, and ORE distribution summary
- Edit mode (fully separated from play mode) with per-tile drag/reposition, shape (square / rounded / circle), per-tile color, background color, text color, decorative stickers, reset, and browser-local persistence
- Shared ORE chat shell using the documented public API pattern:
  - `GET https://api.ore.supply/chat/history`
  - realtime connect via `https://api.ore.supply/connect`
  - wallet-sign auth via `POST https://api.ore.supply/auth/login`
  - send via `POST https://api.ore.supply/chat/send`
- Donation panel kept separate from protocol actions

## Local development

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```
