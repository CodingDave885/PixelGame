export const TILE_SIZE = 16;

export enum Tile {
  Grass = "grass",
  GrassFlower = "grass_flower",
  Water = "water",
  Path = "path",
  Tree = "tree",
  Fence = "fence",
  HouseRoof = "house_roof",
  HouseWall = "house_wall",
  HouseDoor = "house_door",
  Well = "well",
  Chest = "chest",
}

export const SOLID_TILES = new Set<Tile>([
  Tile.Water,
  Tile.Tree,
  Tile.Fence,
  Tile.HouseRoof,
  Tile.HouseWall,
  Tile.HouseDoor,
  Tile.Well,
  Tile.Chest,
]);

export function isSolid(tile: Tile): boolean {
  return SOLID_TILES.has(tile);
}
