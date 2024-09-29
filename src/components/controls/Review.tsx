import { Button } from '@nextui-org/button';
import { CircularProgress } from '@nextui-org/progress';
import { useQueryClient } from '@tanstack/react-query';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useStockfish from '../../queries/useStockfish';
import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useStockfishOutputStore } from '../../stores/useStockfishOutputStore';
import Loading from '../Loading';
import EvalGraph from './EvalGraph';

const depth = 12;

export default function Review() {
  const queryClient = useQueryClient();
  const { data: stockfish, isLoading, isFetching, error } = useStockfish();
  const currentGame = useBoardStore(state => state.currentGame);
  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const populate = useEvalStore(state => state.populate);
  const resetCalc = useEvalStore(state => state.reset);

  const {
    reviewState,
    isListening,
    fenIndex,
    best3Moves,
    saveMove,
    listen,
    stopListen,
    review,
    finishReview,
    reset: resetEval,
  } = useStockfishOutputStore(useShallow(state => ({
    reviewState: state.reviewState,
    isListening: state.isListening,
    fenIndex: state.fenIndex,
    best3Moves: state.best3Moves,
    saveMove: state.saveMove,
    listen: state.listen,
    stopListen: state.stopListen,
    review: state.review,
    finishReview: state.finishReview,
    reset: state.reset,
  })));

  const best3MovesSan = best3Moves.map((subArr, i) => subArr.map(obj => lanToSan(obj.pv, i)));
  const completePercentage = Math.floor((best3Moves.length / (currentGame.isCheckmate() ? fens.length - 1 : fens.length)) * 100); // if checkmate, best3Moves has one less item than fens

  function lanToSan(lan: string, i: number) {
    const possibleMoves = new Chess(fens[i]).moves({ verbose: true });
    const found = possibleMoves.find(move => move.lan === lan)!;

    if (!found) {
      console.log(`cant find legal move ${lan} in fen [${i}]: ${fens[i]}`);

      return `lan-${lan}`;
    }

    return found!.san;
  }

  const outputListener = useCallback((message: string) => {
    if (
      message.includes('info')
      && message.includes('depth')
      && !message.includes('currmove')
      && !message.includes('bound')
    ) {
      const depthRegex = /(?<=\sdepth\s)\w+/;
      const currDepth = Number(message.match(depthRegex)![0]);
      const nodesRegex = /(?<=nodes\s)\w+/;
      const nodes = Number(message.match(nodesRegex)![0]);
      const multiPvRegex = /(?<=multipv\s)\d/;
      const multiPv = Number(message.match(multiPvRegex)![0]);
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
        saveMove({ nodes, pv, multiPv, cp, mate }, message);
      }
    }

    if (message.includes('bestmove')) {
      stopListen(fens.length);
    }
  }, []);

  useEffect(() => {
    if (stockfish) {
      stockfish.postMessage('setoption name MultiPV value 3');
      (stockfish as any).addMessageListener(outputListener);

      return () => {
        stockfish.terminate();
      };
    }
  }, [stockfish]);

  useEffect(() => {
    return () => {
      resetEval();
      resetCalc();
      queryClient.invalidateQueries({ queryKey: ['stockfish'] }); // force recreate Stockfish worker every subsequent mounts
    };
  }, []);

  useEffect(() => {
    if (completePercentage === 100) {
      finishReview();
      populate();
    }
  }, [completePercentage]);

  useEffect(() => {
    /*
      Instead of sending all the fens to Stockfish at once,
      we send one fen at a time, listen to its output,
      and only send the next fen when the previous one is done (when isListening is 'false' again)
    */
    if (stockfish && reviewState === 'reviewing') {
      if (!isListening) {
        stockfish.postMessage(`position fen ${fens[fenIndex]}`);
        stockfish.postMessage(`go depth ${depth}`);
        console.info(`posted position and go for fenIndex ${fenIndex}`);
        listen();
      }
    }
  }, [stockfish, reviewState, isListening]);

  useEffect(() => {
    console.info(isListening);
  }, [isListening]);

  if (isLoading || isFetching)
    return <Loading />;

  if (error)
    return 'Error while loading Stockfish';

  return (
    <div id="Review">
      {reviewState === 'idle' && <Button className="mr-2" color="primary" onPress={review}>Review</Button>}
      {reviewState === 'reviewing' && (
        <CircularProgress
          aria-label="Reviewing..."
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
        <p>
          reviewState:
          {reviewState}
        </p>
        <p>
          isListening:
          {isListening.toString()}
        </p>
        <p>
          fenIndex:
          {fenIndex}
        </p>
        <p>
          fens.length:
          {fens.length}
        </p>
        <p>
          best3Moves.length:
          {best3Moves.length}
        </p>
        {reviewState === 'finished' && <EvalGraph />}
        <div className="grid grid-cols-[30px,_1fr] gap-4">
          <code className="justify-self-end font-bold">i</code>
          <code className="font-bold">Best 3 Moves</code>
        </div>
        {best3MovesSan.map((subArr, i) => (
          <div
            className="grid grid-cols-[30px,_1fr] gap-4"
            key={i}
          >
            <code className="justify-self-end">{i}</code>
            <code>{JSON.stringify(subArr)}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
