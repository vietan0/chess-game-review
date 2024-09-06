import { Button } from '@nextui-org/button';
import { CircularProgress } from '@nextui-org/progress';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useStockfish from '../../queries/useStockfish';
import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import Loading from '../Loading';

const depth = 12;

export default function Review() {
  const { data: stockfish, isLoading, error } = useStockfish();
  const currentGame = useBoardStore(state => state.currentGame);
  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];

  const {
    best3Moves,
    cps,
    winPercents,
    reset,
    saveMove,
  } = useEvalStore(useShallow(state => ({
    best3Moves: state.best3Moves,
    cps: state.computed.cps,
    winPercents: state.computed.winPercents,
    reset: state.reset,
    saveMove: state.saveMove,
  })));

  const best3MovesSan = best3Moves.map((subArr, i) => subArr.map(obj => lanToSan(obj.pv, i)));
  const completePercentage = Math.floor((best3Moves.length / (currentGame.isCheckmate() ? fens.length - 1 : fens.length)) * 100); // if checkmate, best3MovesLans has one less item than fens

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
    // console.log(message);

    if (message.includes('info') && message.includes('depth')) {
      const depthRegex = /(?<=\sdepth\s)\w+/;
      const currDepth = Number(message.match(depthRegex)![0]);
      const nodesRegex = /(?<=nodes\s)\w+/;
      const nodes = Number(message.match(nodesRegex)![0]);
      const pvRegex = /(?<=\spv\s)\w+/;
      const pv = message.match(pvRegex)![0];
      // score could be 'cp x' or 'mate y'
      const cpRegex = /(?<=cp\s)[\d-]+/;
      const cpMatch = message.match(cpRegex);
      const cp = cpMatch ? Number(cpMatch) : undefined;
      const mateRegex = /(?<=mate\s)[\d-]+/;
      const mateMatch = message.match(mateRegex);
      const mate = mateMatch ? Number(mateMatch) : undefined;

      if (currDepth === depth) {
        saveMove({ nodes, pv, cp, mate });
      }
    }
  }, []);

  useEffect(() => {
    if (stockfish) {
      stockfish.postMessage('setoption name MultiPV value 3');
      (stockfish as any).addMessageListener(outputListener);

      return () => {
        (stockfish as any).removeMessageListener(outputListener);
      };
    }
  }, [stockfish]);

  useEffect(() => {
    return () => reset();
  }, []);

  function analyze() {
    reset();

    if (!stockfish) {
      return;
    }

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
      {completePercentage !== 0 && completePercentage !== 100 && (
        <CircularProgress
          aria-label="Analyzing..."
          classNames={{
            svg: 'w-20 h-20',
            value: 'text-md font-semibold text-white',
          }}
          showValueLabel={true}
          size="lg"
          value={completePercentage}
        />
      )}
      <div>
        <div className="grid grid-cols-[70px,_60px,_1fr] gap-4">
          <code className="justify-self-end font-bold">CP</code>
          <code className="font-bold">Win %</code>
          <code className="font-bold">Best 3 Moves</code>
        </div>
        {cps.map((_, i) => (
          <div className="grid grid-cols-[70px,_60px,_1fr] gap-4" key={i}>
            <code className="justify-self-end">{cps[i]}</code>
            <code>{winPercents[i]}</code>
            <code>{JSON.stringify(best3MovesSan[i])}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
