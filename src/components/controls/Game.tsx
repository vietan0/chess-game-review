import { Card, CardBody } from '@heroui/react';

import Result from '../../icons/result/Result';
import TimeClass from '../../icons/time-class/TimeClass';
import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useStageStore } from '../../stores/useStageStore';
import cn from '../../utils/cn';
import convertLichessTimeClass from '../../utils/convertLichessTimeClass';
import { formatChessComTimeControl, formatLichessTimeControl } from '../../utils/formatTimeControl';
import getChessComResult from '../../utils/getChessComResult';
import getLichessResult from '../../utils/getLichessResult';
import isChessCom from '../../utils/isChessCom';
import isChessComBotGame from '../../utils/isChessComBotGame';
import isLichessAI from '../../utils/isLichessAI';
import isLichessBotGame from '../../utils/isLichessBotGame';

import type { ChessComGame, LichessAI, LichessGame, LichessPlayer } from '../../queries/useMonthlyArchives';

export default function Game({ game }: { game: ChessComGame | LichessGame }) {
  const loadGame = useBoardStore(state => state.loadGame);
  const username = useSelectGameStore(state => state.username)!;
  const submitGame = useSelectGameStore(state => state.submitGame);
  const showRatings = useSettingsStore(state => state.settings.showRatings);
  const setStage = useStageStore(state => state.setStage);

  function getLichessUsername(player: LichessPlayer | LichessAI) {
    return isLichessAI(player) ? `lichess AI level ${player.aiLevel}` : player.user.id;
  }

  function getLichessRating(player: LichessPlayer | LichessAI) {
    return isLichessAI(player) ? 0 : player.rating;
  }

  const result = isChessCom(game) ? getChessComResult(username, game) : getLichessResult(username, game);

  const timeClass = isChessCom(game)
    ? isChessComBotGame(game)
      ? 'bot'
      : game.time_class
    : isLichessBotGame(game)
      ? 'bot'
      : convertLichessTimeClass(game.speed);

  const timeControl = isChessCom(game)
    ? isChessComBotGame(game)
      ? null
      : formatChessComTimeControl(game.time_control)
    : formatLichessTimeControl(game);

  const wName = isChessCom(game) ? game.white.username : getLichessUsername(game.players.white);
  const bName = isChessCom(game) ? game.black.username : getLichessUsername(game.players.black);
  const wRating = isChessCom(game) ? game.white.rating : getLichessRating(game.players.white);
  const bRating = isChessCom(game) ? game.black.rating : getLichessRating(game.players.black);
  const totalMovesRegex = /\d+(?=\.\s)/g;
  const totalMoves = game.pgn.match(totalMovesRegex)!.length;

  return (
    <Card
      classNames={{
        base: cn(`
          border-b border-default-300/50 bg-transparent text-sm
          data-[hover=true]:bg-content4/20
          dark:data-[hover=true]:bg-content4/20
        `),
        body: cn('flex-row items-center gap-3 py-3 pr-4 pl-2'),
      }}
      disableAnimation
      fullWidth
      isHoverable
      isPressable
      onPress={() => {
        setStage('loaded');
        loadGame(game.pgn);
        submitGame(game);
      }}
      radius="none"
      shadow="none"
    >
      <CardBody>
        <div className="flex w-10 min-w-10 flex-col items-center gap-1" id="time-control">
          <TimeClass className="size-5" timeClass={timeClass} />
          <span className="text-xs text-nowrap text-foreground-500">
            {timeControl}
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5" id="players-info">
          <div className="flex items-center gap-2">
            <span className="truncate">{wName}</span>
            {showRatings && (
              <span className="text-xs leading-4 font-bold text-foreground-500">
                {wRating}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="truncate">{bName}</span>
            {showRatings && (
              <span className="text-xs leading-4 font-bold text-foreground-500">
                {bRating}
              </span>
            )}
          </div>
        </div>
        <div className={`
          ml-auto flex w-20 items-center justify-between gap-10 text-xs
        `}
        >
          <span className="text-default-500">{totalMoves}</span>
          <Result className="size-5" result={result} />
        </div>
      </CardBody>
    </Card>
  );
}
