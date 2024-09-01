import { Button } from '@nextui-org/button';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import { useEffect, useState } from 'react';

import useStockfish from '../queries/useStockfish';
import { useBoardStore } from '../useBoardStore';

export default function Review() {
  const { data: stockfish, isLoading, error } = useStockfish();
  const currentGame = useBoardStore(state => state.currentGame);
  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const [bestMoveLans, setBestMoveLans] = useState<string[]>([]);
  const bestMoveSans = bestMoveLans.map(lanToSan);

  function lanToSan(lan: string, i: number) {
    const possibleMoves = new Chess(fens[i]).moves({ verbose: true });
    const found = possibleMoves.find(move => move.lan === lan)!;

    return found!.san;
  }

  function stopStockfish() {
    if (stockfish) {
      postMessage('stop');
      stockfish.terminate();
    }
  }

  useEffect(() => {
    console.count('add event listener');

    if (stockfish) {
      (stockfish as any).addMessageListener((message: string) => {
        console.log(message);

        if (message.includes('bestmove')) {
          const bestMoveRegex = /(?<=bestmove\s)\w+/;
          const bestMoveMatch = message.match(bestMoveRegex);

          if (bestMoveMatch) {
            setBestMoveLans(prev => [...prev, bestMoveMatch[0]]);
          }
        }
      });
    }
  }, [stockfish]);

  function analyzeGame() {
    if (!stockfish) {
      console.info('cant analyze, stockfish not loaded');

      return;
    }

    for (const fen of fens) {
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go depth 12');
    }
  }

  if (isLoading)
    return 'Loading Stockfish...';

  if (error)
    return 'Error while loading Stockfish';

  return (
    <div id="Review">
      <Button onPress={analyzeGame}>Analyze Game</Button>
      <pre>{JSON.stringify(bestMoveSans, null, 2)}</pre>
      <Button onPress={stopStockfish}>Terminate Stockfish</Button>
    </div>
  );
}
