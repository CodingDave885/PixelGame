import { Tile, isSolid } from "./tiles";
import { THINGS_COLS, frame } from "./tileset";
import { CHAR_GROUPS, charFrame } from "./characterSheet";

export const MAP_W = 32;
export const MAP_H = 22;

export interface HouseDef {
  name: string;
  x: number; // left tile of the 3-wide footprint
  y: number; // top tile (wall row); door is at (x+1, y+1)
}

export const HOUSES: HouseDef[] = [
  { name: "Cabin", x: 3, y: 3 },
  { name: "Farmhouse", x: 13, y: 3 },
  { name: "Shop", x: 23, y: 3 },
  { name: "Cottage", x: 8, y: 14 },
];

export const PLAZA = { x: 15, y: 11 }; // well position
export const SPAWN = { x: 16, y: 13 }; // player start tile, just south of the well

export interface Overlay {
  x: number;
  y: number;
  texture: "things" | "characters";
  frame: number;
  solid: boolean;
}

// Simple deterministic pseudo-random so the layout is stable across runs.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s % 1000) / 1000;
  };
}

function fillRect(
  grid: Tile[][],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  tile: Tile,
) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (grid[y] && grid[y][x] !== undefined) grid[y][x] = tile;
    }
  }
}

function line(
  grid: Tile[][],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  tile: Tile,
) {
  if (x0 === x1) {
    const [a, b] = y0 < y1 ? [y0, y1] : [y1, y0];
    for (let y = a; y <= b; y++) grid[y][x0] = tile;
  } else {
    const [a, b] = x0 < x1 ? [x0, x1] : [x1, x0];
    for (let x = a; x <= b; x++) grid[y0][x] = tile;
  }
}

function buildHouse(grid: Tile[][], h: HouseDef) {
  // 3 tiles wide, 2 tall: wall row on top, wall/door row below.
  grid[h.y][h.x] = Tile.HouseWall;
  grid[h.y][h.x + 1] = Tile.HouseWindow;
  grid[h.y][h.x + 2] = Tile.HouseWall;
  grid[h.y + 1][h.x] = Tile.HouseWall;
  grid[h.y + 1][h.x + 1] = Tile.HouseDoor;
  grid[h.y + 1][h.x + 2] = Tile.HouseWall;
}

/** Village entrance monument: 3x3 decorative gate, purely solid scenery. */
function buildGate(grid: Tile[][], x: number, y: number) {
  grid[y][x] = Tile.GateCornerTL;
  grid[y][x + 1] = Tile.GateEdgeT;
  grid[y][x + 2] = Tile.GateCornerTR;
  grid[y + 1][x] = Tile.GateWallL;
  grid[y + 1][x + 1] = Tile.GateOpening;
  grid[y + 1][x + 2] = Tile.GateWallR;
  grid[y + 2][x] = Tile.GateCornerBL;
  grid[y + 2][x + 1] = Tile.GateEdgeB;
  grid[y + 2][x + 2] = Tile.GateCornerBR;
}

const FOREST_TILES = [Tile.Tree, Tile.Tree, Tile.BushRound, Tile.BushSpiky];

export function buildVillageMap(): Tile[][] {
  const rand = seeded(1337);
  const pick = (tiles: Tile[]) => tiles[Math.floor(rand() * tiles.length)];
  const grid: Tile[][] = Array.from({ length: MAP_H }, () =>
    Array.from({ length: MAP_W }, () => Tile.Grass),
  );

  // Scatter a few flower/flavor tiles across the open grass.
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const r = rand();
      if (r < 0.035) grid[y][x] = Tile.GrassFlower;
      else if (r < 0.06) grid[y][x] = Tile.GrassTuft;
    }
  }

  // Border ring of trees, with a two-tile gap at the bottom for the road out of town.
  for (let x = 0; x < MAP_W; x++) {
    grid[0][x] = Tile.Tree;
    if (x < 14 || x > 17) grid[MAP_H - 1][x] = Tile.Tree;
  }
  for (let y = 0; y < MAP_H; y++) {
    grid[y][0] = Tile.Tree;
    grid[y][MAP_W - 1] = Tile.Tree;
  }

  // A second, mixed ring just inside the border for a fuller tree line — later
  // features (houses, the gate, paths, the garden) are drawn after this and
  // correctly overwrite any of these tiles they need.
  for (let x = 1; x < MAP_W - 1; x++) {
    if (rand() < 0.65) grid[1][x] = pick(FOREST_TILES);
    if ((x < 14 || x > 17) && rand() < 0.65) grid[MAP_H - 2][x] = pick(FOREST_TILES);
  }
  for (let y = 1; y < MAP_H - 1; y++) {
    if (rand() < 0.65) grid[y][1] = pick(FOREST_TILES);
    if (rand() < 0.65) grid[y][MAP_W - 2] = pick(FOREST_TILES);
  }

  // Houses.
  for (const h of HOUSES) buildHouse(grid, h);

  // Village entrance monument, tucked between the Cabin and Farmhouse.
  buildGate(grid, 7, 0);

  // Paths: a horizontal spine through the plaza, connecting to each house door,
  // plus a road leading out through the bottom gap.
  const spineY = 11;
  line(grid, 2, spineY, MAP_W - 3, spineY, Tile.Path);
  line(grid, PLAZA.x, spineY, PLAZA.x, MAP_H - 2, Tile.Path);
  line(grid, PLAZA.x - 1, MAP_H - 2, PLAZA.x + 2, MAP_H - 2, Tile.Path);

  for (const h of HOUSES) {
    const doorX = h.x + 1;
    const apronY = h.y + 2; // first open tile in front of the door
    if (h.y < spineY) {
      // House sits above the spine: a straight vertical connector clears the building.
      line(grid, doorX, apronY, doorX, spineY, Tile.Path);
    } else {
      // House sits below the spine: route sideways to the plaza's south corridor
      // instead of straight up, which would cut through the building itself.
      line(grid, doorX, apronY, PLAZA.x, apronY, Tile.Path);
    }
  }

  // A round-ish plaza pad around the well, like a fountain courtyard, with a
  // little greenery framing its NW/NE corners.
  const plazaRadius = 3;
  for (let y = PLAZA.y - plazaRadius; y <= PLAZA.y + plazaRadius; y++) {
    for (let x = PLAZA.x - plazaRadius; x <= PLAZA.x + plazaRadius; x++) {
      const dist = Math.abs(x - PLAZA.x) + Math.abs(y - PLAZA.y);
      if (dist <= plazaRadius && grid[y]?.[x] !== undefined && !isSolid(grid[y][x])) {
        grid[y][x] = Tile.Path;
      }
    }
  }
  grid[PLAZA.y - 2][PLAZA.x - 2] = Tile.BushRound;
  grid[PLAZA.y - 2][PLAZA.x + 2] = Tile.BushRound;

  // A few scattered rocks and a small market-stall crate cluster by the Shop.
  grid[7][20] = Tile.Rock;
  grid[3][11] = Tile.Rock;
  grid[15][19] = Tile.Rock;
  grid[13][24] = Tile.Rock;
  grid[10][5] = Tile.Rock;
  grid[5][21] = Tile.CrateSwords;
  grid[6][21] = Tile.CrateVase;

  // Plaza well.
  grid[PLAZA.y][PLAZA.x] = Tile.Well;

  // Pond, bottom-left, with a sandy shoreline ring.
  fillRect(grid, 1, 15, 7, 20, Tile.Sand);
  fillRect(grid, 2, 16, 6, 19, Tile.Water);

  // A tidy little garden plot beside the Cottage.
  fillRect(grid, 9, 17, 12, 18, Tile.GrassFlower);
  grid[17][10] = Tile.GrassTuft;
  grid[18][11] = Tile.GrassTuft;

  // Fenced garden, top-right, with hedge corners and a chest inside
  // (kept clear of the Shop's path column).
  fillRect(grid, 25, 5, 30, 8, Tile.Fence);
  fillRect(grid, 26, 6, 29, 7, Tile.GrassFlower);
  grid[6][27] = Tile.Chest;
  grid[5][25] = Tile.HedgeTopiary;
  grid[5][30] = Tile.HedgeTopiary;
  grid[8][25] = Tile.HedgeTopiary;
  grid[8][30] = Tile.HedgeTopiary;

  // Make sure the spawn point stays walkable path.
  grid[SPAWN.y][SPAWN.x] = Tile.Path;

  return grid;
}

/** Decorative/ambient objects layered on top of the base terrain grid. */
export function buildOverlays(grid: Tile[][]): Overlay[] {
  const torch = frame(4, 0, THINGS_COLS);
  const candidates: Overlay[] = [
    // Torches flanking the plaza, just north of the well.
    { x: PLAZA.x - 1, y: PLAZA.y - 1, texture: "things", frame: torch, solid: true },
    { x: PLAZA.x + 1, y: PLAZA.y - 1, texture: "things", frame: torch, solid: true },
    // A torch beside every house's entrance.
    ...HOUSES.map((h) => ({
      x: h.x + 3,
      y: h.y + 1,
      texture: "things" as const,
      frame: torch,
      solid: true,
    })),
    // A couple of idle villagers milling near their houses.
    {
      x: 2,
      y: 5,
      texture: "characters",
      frame: charFrame(CHAR_GROUPS.villagerTan, "down"),
      solid: true,
    },
    {
      x: 26,
      y: 9,
      texture: "characters",
      frame: charFrame(CHAR_GROUPS.villagerDress, "down"),
      solid: true,
    },
    // Slimes lazing near the pond.
    {
      x: 7,
      y: 15,
      texture: "characters",
      frame: charFrame(CHAR_GROUPS.slime, "down"),
      solid: true,
    },
    {
      x: 3,
      y: 15,
      texture: "characters",
      frame: charFrame(CHAR_GROUPS.slime, "left"),
      solid: true,
    },
    // A little wildlife along the forest edge.
    {
      x: 2,
      y: 2,
      texture: "characters",
      frame: charFrame(CHAR_GROUPS.bat, "down"),
      solid: true,
    },
    {
      x: 29,
      y: 19,
      texture: "characters",
      frame: charFrame(CHAR_GROUPS.ghost, "down"),
      solid: true,
    },
  ];

  // Defensive: skip anything that landed on already-solid terrain (water, walls, etc.)
  // so a future map edit can't silently strand an overlay inside a wall.
  return candidates.filter((o) => {
    const tile = grid[o.y]?.[o.x];
    return tile !== undefined && !isSolid(tile);
  });
}
