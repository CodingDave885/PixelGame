# Raw art drop folder

Push your original PNGs here, unmodified (no recompression/resizing), using these
filenames so the integration pass can find them automatically:

| Filename | What I saw in your attachment |
|---|---|
| `terrain_tileset.png` | Big sheet: grass/water/path/stone terrain, building walls/roofs/doors/windows, trees, bushes, fences, the white archway, bench, signpost |
| `creatures_small.png` | The small sheet with the two mushroom-folk and the bat/ghost |
| `props_tileset.png` | Chests, ladders, torches (lit/animated frames), barrels, potions, gems, campfire frames, dark brick tile |
| `character_sheets.png` | The multi-row walk-cycle sheet: player/villager outfits + turtles + blob/spider creatures |
| `font.png` | The bitmap font sheet (blue/orange, upper/lower/italic) |

## Also tell me (in your push, a commit message, or your next message)

1. **Tile size in pixels** for `terrain_tileset.png` and `props_tileset.png` —
   most packs like this are 16x16, but confirm so tiles don't get sliced
   wrong. If you're not sure, I can usually infer it once the file is here.
2. **Frame size** for `character_sheets.png` and `creatures_small.png` (e.g.
   32x32 per frame, 3 frames per direction, rows ordered down/left/right/up —
   whatever your sheet actually uses).
3. **Glyph size / spacing** for `font.png` if it's not a plain fixed-width grid.

Once these land on this branch, I'll run an integration pass: slice the
sheets into a Phaser tileset + spritesheets, swap them in for the current
placeholder textures (`src/scenes/BootScene.ts`), and remove the placeholder
generator.
