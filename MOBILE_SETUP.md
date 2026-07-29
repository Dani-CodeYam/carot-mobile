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

- **Xcode 26.0 or later.** Since 28 Apr 2026 Apple only accepts App Store
  uploads built with the iOS 26 SDK, and Xcode 26 is what ships it.
- **A paid Apple Developer Program membership.** Not optional here: the app
  declares `ios.usesAppleSignIn`, and a free personal team cannot sign the Sign
  in with Apple capability. See *Signing* below.
- Device connected via USB.

### Steps

1. Generate the native iOS project:

```bash
npx expo prebuild --platform ios --clean
```

That also runs `pod install`. No Podfile edits are needed — Expo's own template
sets `SWIFT_VERSION = 5.0` on the app target, so the Swift-6 strict-concurrency
workaround that older versions of this document described is obsolete.

2. Find your device's UDID:

```bash
xcrun xctrace list devices
```

3. Build and install. A **Release** build is usually what you want: it embeds
   the JS bundle, so the app runs standalone without Metro and without your
   phone being on the same Wi-Fi network.

```bash
xcodebuild -workspace ios/ElCarot.xcworkspace \
  -scheme ElCarot \
  -configuration Release \
  -destination 'id=<YOUR-UDID>' \
  -derivedDataPath ios/build \
  -allowProvisioningUpdates \
  build

xcrun devicectl device install app \
  --device <YOUR-UDID> \
  ios/build/Build/Products/Release-iphoneos/ElCarot.app
```

`npx expo run:ios --device` is the shorter path and works for Debug builds, but
it does **not** pass `-allowProvisioningUpdates`, so it fails with "No profiles
for 'com.elcarot.mobile' were found" on any machine that has not already had a
profile created for it. Use `xcodebuild` directly the first time.

### Signing

`npx expo prebuild` generates `ios/` without a development team, and `ios/` is
gitignored — so this has to be re-applied after every `prebuild --clean`. Find
your team ID from the signing certificate:

```bash
security find-certificate -c "Apple Development: <your-apple-id>" -p \
  | openssl x509 -noout -subject | tr ',' '\n' | grep OU
```

Then set `DEVELOPMENT_TEAM` and `CODE_SIGN_STYLE = Automatic` on both the Debug
and Release build configurations of the `ElCarot` target — either in Xcode under
**Signing & Capabilities**, or by editing
`ios/ElCarot.xcodeproj/project.pbxproj`.

### Troubleshooting

- **"Personal development teams … do not support the Sign In with Apple capability"**: Xcode is signed in with an Apple ID that has no active paid membership, so it only offers the free Personal Team. Check **Xcode → Settings → Accounts** — if the account lists only "Personal Team", the Developer Program membership is either on a different Apple ID or not active. Verify at [developer.apple.com/account](https://developer.apple.com/account).
- **"No profiles for 'com.elcarot.mobile' were found … pass -allowProvisioningUpdates"**: You built via `expo run:ios`, which does not pass that flag. Use the `xcodebuild` invocation above.
- **"invalid code signature" / "profile has not been explicitly trusted"**: Your iPhone doesn't trust the developer profile yet. On your iPhone: **Settings → General → VPN & Device Management** → tap your Apple ID → **Trust**. Then relaunch the app.
- **"No script URL provided"**: A Debug build cannot reach Metro. Either build Release (bundle embedded), or start Metro with `npx expo start` and put the phone on the same Wi-Fi network.
- **"Missing factory in ExpoAppDelegate"** crash: The native project is stale. Run `npx expo prebuild --platform ios --clean` to regenerate it.
- **"ambiguous implicit access level for import"** error: The `patch-package` fix wasn't applied. Run `npm install` to reapply, then `cd ios && pod install`.

### Notes

- The `ios/` and `android/` directories are gitignored — they're generated by `expo prebuild` and shouldn't be committed.
- The `patches/` directory IS committed — it patches `expo-modules-autolinking` to emit `public import`, and auto-applies on `npm install`. Keep its filename version in sync with the installed package (`npx patch-package expo-modules-autolinking` regenerates it) or every install prints a mismatch warning.
- Releasing to the App Store is a separate document: see `RELEASE.md`.

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
```

For iOS, see **`RELEASE.md`** — it covers archiving in Xcode, uploading to App
Store Connect, and publishing as a Pre-Order. EAS is not used; the release path
is Xcode's own Archive → Distribute.
