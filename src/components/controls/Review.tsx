import { Button } from '@nextui-org/button';
import { Progress } from '@nextui-org/progress';
import { useQueryClient } from '@tanstack/react-query';
import { DEFAULT_POSITION } from 'chess.js';
import { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import useStockfish from '../../queries/useStockfish';
import { useBoardStore } from '../../stores/useBoardStore';
import { useEvalStore } from '../../stores/useEvalStore';
import { useStageStore } from '../../stores/useStageStore';
import { useStockfishOutputStore } from '../../stores/useStockfishOutputStore';
import Loading from '../Loading';
import ReviewMoves from './ReviewMoves';
import ReviewOverview from './ReviewOverview';

const depth = 12;

export default function Review() {
  const queryClient = useQueryClient();
  const { data: stockfish, isLoading, isFetching, error } = useStockfish();
  const currentGame = useBoardStore(state => state.currentGame);
  const history = currentGame.history({ verbose: true });
  const fens = [DEFAULT_POSITION, ...history.map(move => move.after)];
  const populate = useEvalStore(state => state.populate);
  const resetEval = useEvalStore(state => state.reset);
  const stage = useStageStore(state => state.stage);
  const setStage = useStageStore(state => state.setStage);

  const {
    isListening,
    fenIndex,
    best3Moves,
    saveMove,
    listen,
    stopListen,
    review,
    reset: resetSfOutput,
  } = useStockfishOutputStore(useShallow(state => ({
    isListening: state.isListening,
    fenIndex: state.fenIndex,
    best3Moves: state.best3Moves,
    saveMove: state.saveMove,
    listen: state.listen,
    stopListen: state.stopListen,
    review: state.review,
    reset: state.reset,
  })));

  const completePercentage = Math.floor((best3Moves.length / ((currentGame.isCheckmate() || currentGame.isStalemate()) ? fens.length - 1 : fens.length)) * 100); // if checkmate or stalemate, best3Moves has one less item than fens

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
      // force recreate Stockfish worker every subsequent mounts
      queryClient.invalidateQueries({ queryKey: ['stockfish'] });
      // reset states when leave Review page
      resetSfOutput();
      resetEval();
    };
  }, []);

  useEffect(() => {
    if (completePercentage === 100) {
      populate();
      setStage('review-overview');
    }
  }, [completePercentage]);

  useEffect(() => {
    /*
      Instead of sending all the fens to Stockfish at once,
      we send one fen at a time, listen to its output,
      and only send the next fen when the previous one is done (when isListening is 'false' again)
    */
    if (stockfish && stage === 'reviewing') {
      if (!isListening) {
        listen();
        stockfish.postMessage(`position fen ${fens[fenIndex]}`);
        stockfish.postMessage(`go depth ${depth}`);
        console.info(`posted position and go for fenIndex ${fenIndex}`);
      }
    }
  }, [stockfish, stage, isListening]);

  if (isLoading || isFetching)
    return <Loading />;

  if (error) {
    return (
      <p>
        Loading Stockfish failed:
        {' '}
        <code className="inline-block text-small text-danger-500">
          {error.message}
        </code>
      </p>
    );
  }

  return (
    <div className="h-full" id="Review">
      {stage === 'loaded'
        ? (
            <Button
              className="h-12 text-medium font-bold"
              color="primary"
              fullWidth
              onPress={review}
              radius="sm"
            >
              Generate Review
            </Button>
          )
        : stage === 'reviewing'
          ? (
              <Progress
                aria-label="Reviewing..."
                classNames={{ value: 'font-bold mx-auto' }}
                showValueLabel={true}
                size="lg"
                value={completePercentage}
              />
            )
          : stage === 'review-overview'
            ? <ReviewOverview />
            : stage === 'review-moves'
              ? <ReviewMoves />
              : null}
    </div>
  );
}
