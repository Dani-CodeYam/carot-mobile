# El Carot

A tarot app for the phone, built on a bilingual deck of the 22 major arcana —
each one a familiar face. Draw a card for an open message, ask it a specific
question, or come back for the card of the day, which is pinned to the date and
cannot be rerolled.

Everything runs on the device: draws are local, the question you type never
leaves the phone, and there is no backend.

## Setup

```bash
npm run setup
```

No API keys or services to configure — a fresh clone runs with
`git clone` → `npm run setup` → `npm run dev`.

## Development

Start the Expo dev server (web):

```bash
npm run dev
```

For native platforms:

```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## Using CodeYam Editor

This project was built with [CodeYam](https://codeyam.com). To launch the editor:

```bash
codeyam editor
```

## Scripts

| Script            | Description                 |
| ----------------- | --------------------------- |
| `npm run setup`   | Install dependencies        |
| `npm run dev`     | Start Expo dev server (web) |
| `npm run ios`     | Run on iOS simulator        |
| `npm run android` | Run on Android emulator     |

<!-- codeyam:run-and-edit:start -->
## Develop this project with codeyam-editor

This project is built with [codeyam-editor](https://codeyam.com) — code and runnable data scenarios are authored side by side against a live preview.

```bash
# Clone the repo
git clone https://github.com/Dani-CodeYam/carot-mobile && cd carot-mobile

# Install codeyam-editor
npm install -g @codeyam-editor/codeyam-editor@latest

# Launch the editor (split-screen terminal + live preview)
codeyam-editor editor
```
<!-- codeyam:run-and-edit:end -->

<!-- codeyam:scenario-gallery:start -->
## Scenario gallery

States captured as runnable scenarios with codeyam-editor:

### Carta del día

<img src=".codeyam/scenarios/screenshots/carta-del-día--iphone-16.png" alt="Carta del día" width="280">

### Carta del día - Revelada

<img src=".codeyam/scenarios/screenshots/carta-del-día-revelada--iphone-16.png" alt="Carta del día - Revelada" width="280">

### Cartas anteriores

<img src=".codeyam/scenarios/screenshots/cartas-anteriores--iphone-16.png" alt="Cartas anteriores" width="280">

### Cartas anteriores - Con historial

<img src=".codeyam/scenarios/screenshots/cartas-anteriores-con-historial--iphone-16.png" alt="Cartas anteriores - Con historial" width="280">

### Home

<img src=".codeyam/scenarios/screenshots/home--iphone-16.png" alt="Home" width="280">

### Quiero recibir un mensaje

<img src=".codeyam/scenarios/screenshots/quiero-recibir-un-mensaje--iphone-16.png" alt="Quiero recibir un mensaje" width="280">

### Tengo una pregunta específica

<img src=".codeyam/scenarios/screenshots/tengo-una-pregunta-específica--iphone-16.png" alt="Tengo una pregunta específica" width="280">

### Todas las cartas

<img src=".codeyam/scenarios/screenshots/todas-las-cartas--iphone-16.png" alt="Todas las cartas" width="280">
<!-- codeyam:scenario-gallery:end -->
