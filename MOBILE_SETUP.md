# Expo + React Native Setup

## Development

This project uses **Expo** with **Expo Router** for file-based navigation and **NativeWind** (Tailwind CSS) for styling.

### Web Development (used by CodeYam)

```bash
npm run dev
```

This starts the Expo web dev server. CodeYam uses this to preview your app and take screenshots.

### Mobile Development

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Start Expo dev server (pick platform from menu)
npm start
```

## Project Structure

```
app/                    # Expo Router file-based routes
  _layout.tsx           # Root layout (SafeAreaProvider, StatusBar)
  index.tsx             # Home screen (single entry point)
components/             # Reusable components
lib/
  theme.ts              # Design tokens (colors, spacing, typography)
  storage.ts            # AsyncStorage wrapper for persistent data
__tests__/              # Test files (keep outside app/ — Expo Router treats all app/ files as routes)
```

## Key Patterns

### Navigation (Expo Router)

Add new screens by creating files in `app/`:

- `app/profile.tsx` — accessible at `/profile`
- `app/items/[id].tsx` — dynamic route at `/items/123`

### Data Fetching

Use standard `fetch()` for API calls. CodeYam intercepts these to provide mock data during simulations:

```tsx
const response = await fetch('/api/items');
const data = await response.json();
```

### Storage

Use the typed storage helper for persistent data:

```tsx
import { storage } from '@/lib/storage';

const items = await storage.get('items', []);
await storage.set('items', [...items, newItem]);
```

### Styling (NativeWind)

Use Tailwind classes on React Native components:

```tsx
<View className="flex-1 items-center justify-center bg-white p-4">
  <Text className="text-lg font-bold text-gray-900">Hello</Text>
</View>
```

## CodeYam Scenario Data

### AsyncStorage Seeding

AsyncStorage uses `localStorage` on web, so CodeYam's existing localStorage injection works automatically. Use the `localStorage` field in scenario JSON to pre-populate storage:

```json
{
  "name": "With Saved Items",
  "url": "/",
  "dimensions": ["iPhone 16"],
  "localStorage": {
    "items": "[{\"id\":\"1\",\"title\":\"Buy groceries\",\"done\":false},{\"id\":\"2\",\"title\":\"Walk the dog\",\"done\":true}]"
  }
}
```

Values must be JSON strings (matching how AsyncStorage stores them). Your `storage.get()` calls will read this data normally.

### API Mocking

For apps that fetch from APIs, use relative URLs so CodeYam's proxy can intercept and mock them:

```tsx
// Use relative URLs — these go through the CodeYam proxy
const response = await fetch('/api/items');
```

Then provide mock routes in your scenario data:

```json
{
  "name": "With API Data",
  "url": "/",
  "dimensions": ["iPhone 16"],
  "routes": {
    "/api/items": {
      "body": [{ "id": 1, "title": "First item" }],
      "status": 200
    }
  }
}
```

### Device Presets

Mobile projects default to these screen sizes:

| Preset            | Width | Height |
| ----------------- | ----- | ------ |
| iPhone 16         | 393   | 852    |
| iPhone 16 Pro Max | 430   | 932    |
| iPhone SE         | 375   | 667    |
| Pixel 8           | 412   | 915    |
| iPad mini         | 744   | 1133   |

## Design Tokens (lib/theme.ts)

All design tokens live in `lib/theme.ts` — this is the **single source of truth** for colors, spacing, typography, and border radius. Import and use in every component:

```tsx
import { theme } from '@/lib/theme';

<View
  style={{ backgroundColor: theme.colors.bgBase, padding: theme.spacing.lg }}
>
  <Text
    style={{ fontSize: theme.fontSize.lg, color: theme.colors.textPrimary }}
  >
    Hello
  </Text>
</View>;
```

**Do NOT:**

- Use CSS custom properties (`var(--token)`) — they don't work in React Native
- Hardcode color strings or pixel values in components
- Create a separate `globals.css` token system — `lib/theme.ts` is the only source

When a design system is selected, populate `lib/theme.ts` with its tokens.

## Testing

Tests use Jest with the `jest-expo` preset. Run with:

```bash
npx jest                          # Run all tests
npx jest app/hooks/useCounter.ts  # Run specific test file
```

The Jest config is in `package.json`. The `transformIgnorePatterns` is pre-configured to handle Expo and React Native module transforms — you should not need to modify it.

## Building for a Real iOS Device

### Prerequisites

- **Xcode 16.x** (Xcode 16.4 or later recommended)
- **Apple Developer account** (free is fine for personal devices)
- Device connected via USB or on the same Wi-Fi network

### Steps

1. Generate the native iOS project:

```bash
npx expo prebuild --clean
```

2. Add Swift 5 enforcement to the generated Podfile. Open `ios/Podfile` and add this inside the `post_install` block, after `react_native_post_install(...)`:

```ruby
    # Fix Swift 6.1 (Xcode 16.4) strict concurrency errors
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['SWIFT_VERSION'] = '5.0'
      end
    end
```

3. Reinstall pods with the fix:

```bash
cd ios && pod install && cd ..
```

4. Build and run on your device:

```bash
npx expo run:ios --device
```

### Troubleshooting

- **"invalid code signature" / "profile has not been explicitly trusted"**: Your iPhone doesn't trust the developer profile yet. On your iPhone: **Settings → General → VPN & Device Management** → tap your Apple ID → **Trust**. Then relaunch the app.
- **"No script URL provided"**: Metro bundler isn't running or the device can't reach it. Start Metro with `npx expo start` in a separate terminal, then relaunch the app. Your phone and Mac must be on the same Wi-Fi network.
- **"Missing factory in ExpoAppDelegate"** crash: The native project is stale. Run `npx expo prebuild --clean` to regenerate it.
- **"ambiguous implicit access level for import"** error: The `patch-package` fix wasn't applied. Run `npm install` to reapply, then `cd ios && pod install`.

### Notes

- The `ios/` and `android/` directories are gitignored — they're generated by `expo prebuild` and shouldn't be committed.
- The `patches/` directory IS committed — it contains a fix for Xcode 16.4 Swift compatibility that auto-applies on `npm install`.

## Web vs Native Differences

The CodeYam editor previews your app via **Expo Web** (react-native-web in a browser). Some differences from native iOS/Android devices are expected:

| Aspect           | Web Preview                                            | Native Device                                           |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| **Fonts**        | System fonts, may differ in weight/metrics/line-height | Loaded custom fonts (if added via expo-font)            |
| **SafeAreaView** | No effect (no notch in browser)                        | Applies real safe area insets for notch, home indicator |
| **Platform.OS**  | Returns `'web'`                                        | Returns `'ios'` or `'android'`                          |
| **Shadows**      | Uses CSS `box-shadow` (works well)                     | Uses RN shadow props (iOS) or `elevation` (Android)     |
| **Gestures**     | Mouse drag events                                      | Touch/swipe with inertia                                |
| **StatusBar**    | No visible effect                                      | Controls device status bar appearance                   |
| **Haptics**      | No-op                                                  | Real haptic feedback via `expo-haptics`                 |
| **Pressable**    | `backgroundColor`/`borderStyle` work on Pressable      | Must use View wrapper (see below)                       |

### Pressable Styling on Native

`<Pressable>` with `backgroundColor`, `borderRadius`, or `borderStyle: 'dashed'` renders correctly in the web preview but **fails silently on native devices** — the background/border simply won't appear.

**Fix:** Put visual styles on a wrapping `<View>` and use `onPressIn`/`onPressOut` for press feedback:

```tsx
const [pressed, setPressed] = useState(false);

<View
  style={{
    backgroundColor: theme.colors.bgInverse,
    borderRadius: 60,
    overflow: 'hidden',
  }}
>
  <Pressable
    onPress={onPress}
    onPressIn={() => setPressed(true)}
    onPressOut={() => setPressed(false)}
    style={{
      opacity: pressed ? 0.8 : 1,
      alignItems: 'center',
      padding: theme.spacing.lg,
    }}
  >
    <Text style={{ color: theme.colors.accent }}>+</Text>
  </Pressable>
</View>;
```

For dashed borders, put `borderStyle`, `borderWidth`, and `borderColor` on the outer `<View>`, not on `<Pressable>`.

**The web preview is for layout and data verification.** Test final visual polish on a real device or simulator:

```bash
npm run ios       # iOS Simulator
npm run android   # Android Emulator
npm start         # Pick platform from Expo menu
```

## Building for Production

```bash
# Web
npm run build:web

# iOS/Android (requires EAS CLI)
npx eas build
```
