# Material para la App Store

Todo lo que hace falta para armar la ficha, menos lo que depende de tu cuenta.

| Archivo | Qué es |
| --- | --- |
| `listing.md` | Nombre, subtítulo, texto promocional, descripción y keywords, en español e inglés |
| `app-privacy-answers.md` | Qué contestar en App Privacy y en la clasificación por edad |
| `screenshots/` | Capturas nativas a 1320×2868 (6.9") |

La guía del trámite completo está en `RELEASE.md`, en la raíz.

## Las páginas legales no viven acá

La política de privacidad y la página de soporte son páginas del sitio, no
archivos de este repo:

| | |
| --- | --- |
| Privacidad | <https://elcarot.com/privacy> |
| Soporte | <https://elcarot.com/support> |

Se sirven desde el proyecto web de El Carot (`app/privacy/`, `app/support/`),
que es un repositorio aparte. Este directorio tuvo un `privacy-policy.html`
propio mientras no existía la página; se borró al publicarla, porque **dos
copias de una política de privacidad divergen sin que nadie se entere** y
después no se sabe cuál rige. Si hay que cambiar el texto, se cambia en el
sitio.

## Las capturas

Las seis están hechas, todas a 1320×2868 desde el simulador iPhone 17 Pro Max:

| | Pantalla |
| --- | --- |
| `01-home.png` | Home — el abanico y las tres entradas |
| `02-carta-del-dia.png` | Carta del día revelada, con frase y significado |
| `03-elegir-carta.png` | El mazo abierto, a mitad de recorrido |
| `04-pregunta.png` | El formulario de pregunta |
| `05-respuesta.png` | La pregunta junto a la carta que la respondió |
| `06-galeria.png` | La grilla del mazo completo |

`05-respuesta.png` es la más fuerte del set: muestra la pregunta y la respuesta
en un mismo cuadro. `04-pregunta.png` es la más débil — media pantalla vacía —
y está sólo por si querés mostrar el paso previo.

### Dos cosas que hay que hacer a cada captura nueva

**Quitar el canal alfa.** El simulador las emite CON alfa y Apple las rechaza
así. El alfa es totalmente opaco, así que aplanar no cambia un pixel:

```bash
node -e "const s=require('sharp');s('store/screenshots/X.png').flatten({background:'#000'}).png().toBuffer().then(b=>require('fs').writeFileSync('store/screenshots/X.png',b))"
```

**Mirar si hay desnudos.** Seis de las 22 cartas los tienen, por la iconografía
clásica de Rider-Waite: Los Amantes, El Diablo, La Estresha, El Sol, El Juicio
Final y El Mundo. Dentro de la app no es problema con una clasificación 12+,
pero **una captura de tienda la ve cualquiera navegando la App Store** sin haber
aceptado clasificación alguna, y es motivo de rechazo conocido. `06-galeria.png`
lleva estrellas compuestas encima por eso. El arte original no se tocó: la
censura vive sólo en el PNG de la ficha.

Si volvés a sacar la galería, ojo con las filas de abajo — ahí están El Diablo,
La Estresha, El Sol, El Juicio y El Mundo, las cinco restantes.

## Cómo sacar una captura nueva

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

Apple pide **mínimo 1 y máximo 10**, en PNG o JPEG **sin canal alfa**. Con el
set de 6.9" alcanza: el resto de los tamaños los escala Apple.

## Por qué del simulador y no del preview web

El preview de codeyam es `react-native-web` en un navegador: no tiene barra de
estado, no aplica safe areas y puede medir las fuentes distinto. Apple pide
capturas que representen la app real. El simulador **es** iOS, así que lo que
ves es lo que hay.

Los escenarios de codeyam siguen sirviendo para decidir **qué** estados mostrar
— ya están todos capturados y son los interesantes.
