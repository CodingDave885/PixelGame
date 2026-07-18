import { CHARACTERS_COLS, frame } from "./tileset";

export type Direction = "down" | "left" | "right" | "up";

const DIR_ROW_OFFSET: Record<Direction, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

/** characters.png: 12-col x 8-row sheet of 16x16 frames, in 3-col x 4-row (walk x direction) groups. */
export interface CharGroup {
  col: number;
  row: number;
}

export const CHAR_GROUPS = {
  villagerTan: { col: 0, row: 0 },
  villagerBlue: { col: 3, row: 0 },
  villagerDress: { col: 6, row: 0 },
  skeleton: { col: 9, row: 0 },
  slime: { col: 0, row: 4 },
  bat: { col: 3, row: 4 },
  ghost: { col: 6, row: 4 },
  spider: { col: 9, row: 4 },
} as const satisfies Record<string, CharGroup>;

/** walkFrame: 0 = idle stance, 1/2 = the two step poses. */
export function charFrame(group: CharGroup, dir: Direction, walkFrame: 0 | 1 | 2 = 0): number {
  return frame(group.row + DIR_ROW_OFFSET[dir], group.col + walkFrame, CHARACTERS_COLS);
}
