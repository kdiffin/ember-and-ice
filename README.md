# Frost & Ember

A side-view, local two-player arcade fighter made with Three.js. Original procedural geometry depicts Scorpion and Sub-Zero in a moonlit temple. No external art assets are required. Google Fonts are optional; system fonts provide a fallback.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. A browser with WebGL 2 is required.

## Controls

Player 1 (Scorpion): A/D move, W jump, S block, J punch, K kick, L hellfire.

Player 2 (Sub-Zero): left/right arrows move, up arrow jumps, down arrow blocks, 1 punches, 2 kicks, 3 launches ice. Use the number row or numpad with Num Lock on.

Escape: pause. M: sound. Both players share one keyboard. Separate touch controls are available on narrow screens.

Win two rounds. Each round lasts 60 seconds. Blocking reduces damage, jumping avoids projectiles, and an unblocked ice strike freezes its target briefly. Specials recharge in four seconds. Equal health at timeout replays a round without awarding a point.

## Verify

```sh
npm test
npm run build
```

`src/combat.js` owns deterministic combat state; `src/main.js` owns rendering, input, audio, and HUD. The renderer uses an orthographic camera with movement restricted to a single fighting plane. See the [Three.js camera documentation](https://threejs.org/docs/pages/OrthographicCamera.html).

For the browser smoke test, start the dev server on port 5173, then run:

```sh
npx playwright install chromium
npm run test:browser
```

The smoke test checks WebGL startup, quick-tap special attacks, pause behavior, help, and mobile overflow. Screenshots are written to `/tmp/frost-and-ember-*.png`.
