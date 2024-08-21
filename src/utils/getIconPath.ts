export default function getIconPath(name: string, folder: string, ext: string) {
  return new URL(`../icons/${folder}/${name}.${ext}`, import.meta.url).href;
}
