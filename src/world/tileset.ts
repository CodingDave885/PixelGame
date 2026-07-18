export const TILE_SIZE = 16;
export const BASICTILES_COLS = 8;
export const THINGS_COLS = 12;
export const CHARACTERS_COLS = 12;

/** Frame index into a spritesheet laid out row-major with the given column count. */
export function frame(row: number, col: number, cols: number): number {
  return row * cols + col;
}
