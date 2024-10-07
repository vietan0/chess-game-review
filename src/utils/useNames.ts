import { useBoardStore } from '../stores/useBoardStore';

export default function useNames() {
  const currentGame = useBoardStore(state => state.currentGame);
  const header = currentGame.header();
  let wName;
  let bName;

  if (header.White && header.White !== '?') {
    wName = header.White;
  }
  else {
    wName = 'White';
  }

  if (header.Black && header.Black !== '?') {
    bName = header.Black;
  }

  else {
    bName = 'Black';
  }

  return [wName, bName];
}
