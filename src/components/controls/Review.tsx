import { Button } from '@nextui-org/button';
import { CircularProgress } from '@nextui-org/progress';
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
  const isLoaded = useStageStore(state => state.computed.isLoaded);

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
    reset: resetSfOutput,
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

  const completePercentage = Math.floor((best3Moves.length / (currentGame.isCheckmate() ? fens.length - 1 : fens.length)) * 100); // if checkmate, best3Moves has one less item than fens

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
    // force recreate Stockfish worker every subsequent mounts
    return () => {
      queryClient.invalidateQueries({ queryKey: ['stockfish'] });
    };
  }, []);

  useEffect(() => {
    // reset states when leave Review page
    if (!isLoaded) {
      resetSfOutput();
      resetEval();
    }
  }, [stage]);

  useEffect(() => {
    if (completePercentage === 100) {
      finishReview();
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
    if (stockfish && reviewState === 'reviewing') {
      if (!isListening) {
        listen();
        stockfish.postMessage(`position fen ${fens[fenIndex]}`);
        stockfish.postMessage(`go depth ${depth}`);
        console.info(`posted position and go for fenIndex ${fenIndex}`);
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

  const statesDiv = (
    <div id="states">
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
    </div>
  );

  return (
    <div className="h-full" id="Review">
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
      {stage === 'review-overview' ? <ReviewOverview /> : <ReviewMoves /> }
    </div>
  );
}
