# Material para la App Store

Todo lo que hace falta para armar la ficha, menos lo que depende de tu cuenta.

| Archivo | Qué es |
| --- | --- |
| `listing.md` | Nombre, subtítulo, texto promocional, descripción y keywords, en español e inglés |
| `privacy-policy.html` | Política de privacidad lista para alojar. **Reemplazá el mail** antes de subirla |
| `app-privacy-answers.md` | Qué contestar en App Privacy y en la clasificación por edad |
| `screenshots/` | Capturas nativas a 1320×2868 (6.9") |

La guía del trámite completo está en `RELEASE.md`, en la raíz.

## Cómo sacar las capturas que faltan

`01-home.png` ya está. Las demás necesitan navegar por la app, así que van a
mano — que además es mejor, porque elegís vos qué carta sale.

Arrancá el simulador con la build actual:

```bash
xcodebuild -workspace ios/ElCarot.xcworkspace -scheme ElCarot \
  -configuration Release -derivedDataPath ios/build \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro Max' \
  CODE_SIGNING_ALLOWED=NO build

xcrun simctl boot "iPhone 17 Pro Max"
open -a Simulator
xcrun simctl install "iPhone 17 Pro Max" \
  ios/build/Build/Products/Release-iphonesimulator/ElCarot.app
xcrun simctl launch "iPhone 17 Pro Max" com.elcarot.mobile
```

Después, por cada pantalla: navegás tocando en el simulador y corrés

```bash
xcrun simctl io "iPhone 17 Pro Max" screenshot store/screenshots/NN-nombre.png
```

Las que valen la pena, en orden:

1. `01-home.png` — hecha
2. `02-carta-del-dia.png` — Carta del día, ya revelada, con su significado
3. `03-elegir-carta.png` — el mazo abierto en "Quiero recibir un mensaje"
4. `04-pregunta.png` — la pantalla de pregunta con algo escrito
5. `05-galeria.png` — Todas las cartas, que es donde el mazo se luce

Apple pide **mínimo 1 y máximo 10**, en PNG o JPEG **sin canal alfa**. Las
capturas del simulador ya salen así. Con el set de 6.9" alcanza: el resto de
los tamaños los escala Apple.

## Por qué del simulador y no del preview web

El preview de codeyam es `react-native-web` en un navegador: no tiene barra de
estado, no aplica safe areas y puede medir las fuentes distinto. Apple pide
capturas que representen la app real. El simulador **es** iOS, así que lo que
ves es lo que hay.

Los escenarios de codeyam siguen sirviendo para decidir **qué** estados mostrar
— ya están todos capturados y son los interesantes.
