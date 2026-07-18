# Raw art (source of truth)

These are the original PNGs (uploaded to `main`, now merged into every branch).
`public/game-assets/` holds the copies Vite actually serves to the game at
runtime — if you replace a file here, copy it there too.

| File | Contents | Grid |
|---|---|---|
| `basictiles.png` | Terrain, buildings, plants, the white entrance gate, well, chest, weapons/furniture | 16x16 tiles, 8 cols x 15 rows |
| `things.png` | Doors/ladders, chests, cauldrons, torches (3-frame flicker), bombs, gems, wall+torch | 16x16 tiles, 12 cols x 8 rows |
| `characters.png` | 4 humanoid + 4 creature groups (slime/bat/ghost/spider), each a 3-col (walk frames) x 4-row (down/left/right/up) block | 16x16 frames, 12 cols x 8 rows |
| `dead.png` | Matching "defeated" poses for the cast in `characters.png` (not wired up yet) | 16x16 frames, 3 cols x 4 rows |
| `fontlarge.png` | Bitmap font, upper/lower case, blue + orange variants | 16px-wide cols, 4 non-uniform-height rows (lowercase rows include descenders) |

Frame-index math and the tile/character legend live in code, not here:
`src/world/tileset.ts`, `src/world/tiles.ts`, `src/world/characterSheet.ts`,
`src/ui/BitmapFont.ts`.

## Not yet used

- `dead.png` (defeated/knocked-out poses) — earmarked for a future
  battle/interaction system.
- The skeleton/bat/ghost/spider creature frames in `characters.png` — only
  the slime is placed as ambient decoration right now.
- Most of `things.png` (chests/ladders/bombs/gems/campfire) beyond the two
  plaza torches.

Drop new art in here with a short note on tile size and frame layout if you
want it integrated.
