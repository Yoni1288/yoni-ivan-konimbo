// Full class names so Tailwind can find them; the colors are theme tokens in globals.css.
const TILE_CLASSES: string[] = ["bg-tile-1", "bg-tile-2", "bg-tile-3", "bg-tile-4", "bg-tile-5", "bg-tile-6"]

export const getTileClass = (index: number): string => {
  return TILE_CLASSES[index % TILE_CLASSES.length]
}
