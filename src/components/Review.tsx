import { Button } from '@nextui-org/button';
import { CircularProgress } from '@nextui-org/progress';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import { useCallback, useEffect, useState } from 'react';

import useStockfish from '../queries/useStockfish';
import { useBoardStore } from '../useBoardStore';
import Loading from './Loading';

const depth = 12;

export default function Review() {
  const { data: stockfish, isLoading, error } = useStockfish();
  const currentGame = useBoardStore(state => state.currentGame);
  const currentMoveNum = useBoardStore(state => state.currentMoveNum);
  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const [best3MovesLans, setBest3MovesLans] = useState<{ nodes: number; pv: string }[][]>([]);
  const best3MovesSans = best3MovesLans.map((subArr, i) => subArr.map(obj => lanToSan(obj.pv, i)));
  const completePercentage = Math.floor((best3MovesLans.length / fens.length) * 100);

  function lanToSan(lan: string, i: number) {
    const possibleMoves = new Chess(fens[i]).moves({ verbose: true });
    const found = possibleMoves.find(move => move.lan === lan)!;

    return found!.san;
  }

  const outputListener = useCallback((message: string) => {
    if (message.includes('info') && message.includes('depth')) {
      const depthRegex = /(?<=\sdepth\s)\w+/;
      const currDepth = Number(message.match(depthRegex)![0]);
      if (currDepth === depth)
        console.log(message);
    }

    if (message.includes('bestmove')) {
      console.info(message);
    }

    if (message.includes('info') && message.includes('depth')) {
      const depthRegex = /(?<=\sdepth\s)\w+/;
      const currDepth = Number(message.match(depthRegex)![0]);
      const nodesRegex = /(?<=nodes\s)\w+/;
      const nodes = Number(message.match(nodesRegex)![0]);
      const pvRegex = /(?<=\spv\s)\w+/;
      const pv = message.match(pvRegex)![0];

      if (currDepth === depth) {
        // same node = same move

        setBest3MovesLans((prev) => {
          // 1. if array doesn't include a subarray that includes an object with `nodes`
          // --> create a subarray, add object
          if (prev.some(subArr => subArr.some(obj => obj.nodes === nodes)) === false) {
            if (JSON.stringify({ nodes, pv }) !== JSON.stringify(prev[prev.length - 1]))
              // prevent duplicate if there are duplicated listener added in development (after every Vite HMR save)
              return [...prev, [{ nodes, pv }]];
            else return prev;
          }
          else {
            // 2. array already has subArr with this nodes
            // add { nodes, pv } to subArr
            const lastSubArr = prev[prev.length - 1];
            const moddedLastSubArr = [...lastSubArr, { nodes, pv }];
            // replace last subArr with addedLastSubArr
            const moddedPrev = [...prev];
            moddedPrev.splice(-1, 1, moddedLastSubArr);

            return moddedPrev;
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (stockfish) {
      stockfish.postMessage('setoption name MultiPV value 3');
      (stockfish as any).removeMessageListener(outputListener);
      (stockfish as any).addMessageListener(outputListener);
    }
  }, [stockfish]);

  function analyze() {
    setBest3MovesLans([]);

    if (!stockfish)
      return;

    for (const fen of fens) {
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage(`go depth ${depth}`);
    }
  }

  if (isLoading)
    return <Loading />;

  if (error)
    return 'Error while loading Stockfish';

  return (
    <div id="Review">
      {completePercentage === 0
      && <Button className="mr-2" color="primary" onPress={analyze}>Analyze</Button>}
      <CircularProgress
        aria-label="Analyzing..."
        classNames={{
          svg: 'w-20 h-20',
          value: 'text-md font-semibold text-white',
        }}
        formatOptions={{ style: 'percent' }}
        showValueLabel={true}
        size="lg"
        value={completePercentage}
      />
      <pre className="text-sm">{JSON.stringify(best3MovesSans[currentMoveNum])}</pre>
    </div>
  );
}
