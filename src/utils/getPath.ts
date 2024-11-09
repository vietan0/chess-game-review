export function getPiecePath(name: string, folder: string, ext: string) {
  return new URL(`../icons/${folder}/${name}.${ext}`, import.meta.url).href;
}

export function getBackgroundPath(name: string, ext: string) {
  return new URL(`../backgrounds/${name}.${ext}`, import.meta.url).href;
}
