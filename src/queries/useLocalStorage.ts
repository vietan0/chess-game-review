export default function useLocalStorage(key: string) {
  const item = localStorage.getItem(key);

  function set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  return { item, set };
}
