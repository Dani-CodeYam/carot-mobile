# Ficha de App Store — El Carot

Borradores para pegar en App Store Connect. Editá a gusto: conocés la voz de la
app mejor que yo.

Los límites de caracteres son de Apple y el formulario los corta sin avisar.
Entre paréntesis va el largo actual de cada campo.

> **Una decisión deliberada en la copy:** no se nombra a ninguna celebridad.
> Las cartas se describen como "caras que ya conocés". Nombrar personas reales
> en la ficha de la tienda es exactamente lo que la guideline 5.2 mira, y el
> texto de la ficha es lo primero que lee un revisor. La gracia se entiende
> igual sin dar nombres.

---

## Español

**Name** (máx. 30) — `El Carot` (8)

**Subtitle** (máx. 30) — `El tarot de todos los días` (26)

**Promotional text** (máx. 170, se puede cambiar sin nueva revisión)

```
Una carta por día, sin vueltas. Los 22 arcanos mayores, con caras que ya
conocés. Sin cuenta, sin anuncios, sin que nada salga de tu teléfono.
```
(146)

**Description** (máx. 4000)

```
El Carot es un mazo de tarot para el teléfono: los 22 arcanos mayores, cada
uno con una cara que vas a reconocer.

Hay tres formas de entrar:

Quiero recibir un mensaje — abrís el mazo y elegís una carta a ciegas. Las
cartas vienen mezcladas, así que la posición no dice nada: la elección es
tuya y el resultado no está a la vista.

Tengo una pregunta específica — escribís lo que te preocupa y sacás una
carta para eso. La pregunta se queda escrita al lado de la respuesta.

Carta del día — una sola carta, atada a la fecha. No se puede volver a
tirar. Mañana hay otra.

Todas las cartas quedan en tu historial, y podés recorrer el mazo entero
cuando quieras.

En español y en inglés, con un toque.

Todo pasa en tu teléfono. El Carot no tiene servidores: las tiradas son
locales, la pregunta que escribís no viaja a ningún lado, y no hay anuncios
ni rastreadores. Iniciar sesión es opcional y la app funciona entera sin
hacerlo — sirve solo para que te salude por tu nombre y guarde tus cartas
aparte.
```

**Keywords** (máx. 100, separadas por coma, sin espacios)

```
tarot,cartas,arcanos,adivinacion,horoscopo,astrologia,mistico,esoterico,lectura,oraculo
```
(86)

---

## English

**Name** (máx. 30) — `El Carot` (8)

**Subtitle** (máx. 30) — `Tarot, one card a day` (21)

**Promotional text** (máx. 170)

```
One card a day, no ceremony. All 22 major arcana, wearing faces you already
know. No account, no ads, and nothing ever leaves your phone.
```
(139)

**Description** (máx. 4000)

```
El Carot is a tarot deck for your phone: all 22 major arcana, each one
wearing a face you will recognise.

Three ways in:

I want a message — open the spread and pick a card blind. The deck arrives
shuffled, so where a card sits tells you nothing. The choice is yours and
the answer stays hidden until you make it.

I have a specific question — write down what is on your mind and draw a card
for it. Your question stays beside the answer.

Card of the day — one card, pinned to the date. No rerolls. Tomorrow brings
another.

Every card you draw stays in your history, and you can walk the whole deck
whenever you like.

In Spanish and English, with a wink.

Everything happens on your phone. El Carot has no servers: draws are local,
the question you type never travels anywhere, and there are no ads or
trackers. Signing in is optional and the app works fully without it — it
only lets the app greet you by name and keep your cards in their own drawer.
```

**Keywords** (máx. 100, separadas por coma, sin espacios)

```
tarot,cards,arcana,divination,horoscope,astrology,mystic,esoteric,reading,oracle,fortune
```
(87)

---

## URLs

Las tres van al dominio de la app. Que la política de El Carot viva en el
dominio de El Carot y no en el de otra marca es lo que un revisor espera ver.

| Campo | Valor |
| --- | --- |
| **Privacy Policy URL** | `https://elcarot.com/privacy` — obligatorio |
| **Support URL** | `https://elcarot.com/support` — obligatorio |
| **Marketing URL** | `https://elcarot.com` — opcional; es la app corriendo en web |

Ambas páginas listan `hola@elcarot.com` como contacto. El dominio no tenía
registros MX — el correo rebotaba — así que se resolvió con reenvío de ImprovMX:
`mx1`/`mx2.improvmx.com` más el SPF, cargados en el DNS de Linode (el dominio
está en Namecheap pero delega los nameservers a Linode). El plan gratuito
**recibe pero no envía**: se contesta desde otra casilla, que para App Review
alcanza.

## Campos que faltan y dependen de vos

| Campo | Estado |
| --- | --- |
| **Category** | Sugerencia: Primary **Lifestyle**, Secondary **Entertainment** |
| **Copyright** | `2026 Daniela Raskovsky` — es texto libre y no tiene por qué coincidir con la cuenta. En la ficha van a verse los dos nombres: Nod Labs, Inc. como desarrollador (viene de la cuenta de Apple, no se edita) y este en el copyright |
| **App Review contact** | Tu nombre, mail y teléfono |
