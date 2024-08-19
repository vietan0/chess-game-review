import { useBoardStore } from '../useBoardStore';

export default function useKingSquares() {
  const currentGame = useBoardStore(state => state.currentGame);
  const board = currentGame.board();

  const kings = board
    .flat()
    .filter(piece => piece !== null && piece.type === 'k')
    .sort(a => (a!.color === 'w' ? -1 : 1));

  const squares = kings.map(k => k!.square);

  return squares;
}
