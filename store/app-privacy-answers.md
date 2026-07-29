# App Privacy y clasificación por edad — qué contestar

Basado en lo que la app hace de verdad, verificado leyendo el código: no hay
backend, no hay red salvo el flujo de OAuth opcional, y todo se guarda en
AsyncStorage local (`lib/storage.ts`, `lib/dailyCard.ts`, `lib/auth.tsx`).

> Contestá esto con precisión, ni de más ni de menos. Una etiqueta de privacidad
> inexacta es en sí misma causal de rechazo, y sobre-declarar te obliga a
> justificar recolección que no existe.

## App Privacy

**Pregunta inicial: "Do you or your third-party partners collect data from this app?"**

→ **No**

Eso cierra el cuestionario. El fundamento, por si App Review lo pregunta:

- No hay servidores propios. El repo no tiene backend y el README lo dice.
- Las tiradas, el historial, la carta del día y las preguntas escritas viven en
  el almacenamiento privado de la app, en el dispositivo.
- Sign in with Apple devuelve nombre y mail, pero se escriben **solo** en el
  almacenamiento local para el saludo y para separar el historial por cuenta.
  Nunca se transmiten a un servidor nuestro, porque no existe.
- No hay analítica, publicidad, atribución ni SDKs de terceros que recolecten.

**Ojo con el criterio de Apple:** "collect" significa transmitir datos fuera del
dispositivo. Datos que solo se guardan en el teléfono y nunca se envían **no**
cuentan como recolección. Por eso la respuesta es No y no una lista de
categorías.

## Age Rating

Contestá el cuestionario; con estas respuestas debería dar **12+**.

| Pregunta | Respuesta |
| --- | --- |
| Contenido sexual o desnudez | Ninguno |
| Violencia (dibujada o realista) | Ninguna |
| Blasfemia o humor grosero | Ninguno |
| Alcohol, tabaco o drogas | Ninguno |
| Horror / miedo | Ninguno |
| Juegos de azar simulados | Ninguno |
| **Temas ocultistas o fantasiosos** | **Poco frecuente / leve** — es una app de tarot; no lo escondas |
| Contenido generado por usuarios | Ninguno |
| Acceso web sin restricciones | No |
| Compartir ubicación | No |

La pregunta de ocultismo es la única que mueve la aguja, y es la que
corresponde: una app de tarot que contesta "ninguno" ahí se ve como si
estuviera escondiendo algo.

## Otras declaraciones

**Export compliance** — ya resuelto en el código. `app.json` declara
`ios.config.usesNonExemptEncryption: false`, que llega al Info.plist como
`ITSAppUsesNonExemptEncryption`. Xcode no te va a preguntar en cada subida.

**Sign in with Apple** — la app la ofrece y la capability está en el perfil.
Esto es lo que exige la guideline 4.8 si algún día volvés a ofrecer login con
Google.

**Content rights** — te van a preguntar si tu app contiene, muestra o accede a
contenido de terceros. El arte de las cartas se apoya en fotos de personas
reales; ver la nota de la guideline 5.2 en `RELEASE.md`.

**IDFA / seguimiento** — no. La app no incluye el framework de publicidad ni
pide App Tracking Transparency.
