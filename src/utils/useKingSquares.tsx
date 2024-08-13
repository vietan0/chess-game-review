import { useStore } from '../store';

export default function useKingSquares() {
  const currentGame = useStore(state => state.currentGame);
  const board = currentGame.board();

  const kings = board
    .flat()
    .filter(piece => piece !== null && piece.type === 'k')
    .sort(a => (a!.color === 'w' ? -1 : 1));

  const squares = kings.map(k => k!.square);

  return squares;
}
