import { useBoardStore } from '../stores/useBoardStore';
import { useStageStore } from '../stores/useStageStore';

export default function useResult() {
  const isLoaded = useStageStore(state => state.computed.isLoaded);
  const currentGame = useBoardStore(state => state.currentGame);
  if (!isLoaded)
    return null;

  // if there's headers, use it to determine
  if (Object.keys(currentGame.header()).length > 0) {
    return currentGame.header().Result;
  }

  // no headers
  if (currentGame.isCheckmate()) {
    if (currentGame.turn() === 'w')
      return '0-1'; // black wins
    else return '1-0'; // white wins
  }
  else if (currentGame.isStalemate()) {
    return '1/2-1/2'; // stalemate
  }
  // should be able to determine result even when it's not checkmate or stalemate (e.g. resignation)
  else {
    throw new Error('Result is not 1-0, 0-1, or 1/2-1/2');
  }
}
