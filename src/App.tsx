import { Button } from '@nextui-org/button';
import { Chess } from 'chess.js';
import { useState } from 'react';

import Board from './Board';

export default function App() {
  const [chessInstance, setChessInstance] = useState(new Chess());
  const [_randomState, setRandomState] = useState(0);

  return (
    <>
      <h1 className="text-5xl font-bold text-blue-700">Free Game Review</h1>
      <Board chessInstance={chessInstance} />
      <Button onPress={() => {
        const moves = chessInstance.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        chessInstance.move(move);
        setRandomState(Math.random()); // just to trigger re-render
      }}
      >
        Random move
      </Button>
      <Button onPress={() => {
        setChessInstance(new Chess());
      }}
      >
        Reset
      </Button>
    </>
  );
}
