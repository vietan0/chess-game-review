import { Card, CardBody } from '@nextui-org/card';

import Result from '../../icons/result/Result';
import TimeClass from '../../icons/time-class/TimeClass';
import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatChessComTimeControl, formatLichessTimeControl } from '../../utils/formatTimeControl';
import isChessCom from '../../utils/isChessCom';

import type { ChessComGame, LichessAI, LichessGame, LichessPlayer } from '../../queries/useMonthlyArchives';

function isLichessAI(player: LichessPlayer | LichessAI): player is LichessAI {
  return (player as LichessAI).aiLevel !== undefined;
}

function isChessComBotGame(game: ChessComGame) {
  const botRegex = /-BOT$/;

  return (game.time_class === 'daily'
    && (botRegex.test(game.white.username) || botRegex.test(game.black.username)));
}

export default function Game({ game }: { game: ChessComGame | LichessGame }) {
  const loadGame = useBoardStore(state => state.loadGame);
  const username = useSelectGameStore(state => state.username)!;
  const submitGame = useSelectGameStore(state => state.submitGame);
  const showRatings = useSettingsStore(state => state.settings.showRatings);

  function getChessComResult(game: ChessComGame) {
    const userColor = username.toLowerCase() === game.white.username.toLowerCase() ? 'w' : 'b';

    if (game.pgn.endsWith('1-0\n'))
      return userColor === 'w' ? 'win' : 'lose';
    else if (game.pgn.endsWith('0-1\n'))
      return userColor === 'w' ? 'lose' : 'win';
    else return 'draw';
  }

  function getLichessResult(game: LichessGame) {
    let userColor = '';

    if (isLichessAI(game.players.white)) {
      userColor = 'b';
    }
    else if (isLichessAI(game.players.black)) {
      userColor = 'w';
    }
    else {
      userColor = username.toLowerCase() === game.players.white.user.id.toLowerCase() ? 'w' : 'b';
    }

    if (game.winner === 'white')
      return userColor === 'w' ? 'win' : 'lose';
    else if (game.winner === 'black')
      return userColor === 'w' ? 'lose' : 'win';
    else return 'draw';
  }

  function getLichessUsername(player: LichessPlayer | LichessAI) {
    return isLichessAI(player) ? `lichess AI level ${player.aiLevel}` : player.user.id;
  }

  function getLichessRating(player: LichessPlayer | LichessAI) {
    return isLichessAI(player) ? 0 : player.rating;
  }

  function convertLichessTimeClass(speed: LichessGame['speed']) {
    if (speed === 'correspondence')
      return 'daily';
    if (speed === 'ultraBullet')
      return 'bullet';
    if (speed === 'classical')
      return 'rapid';

    return speed;
  }

  const result = isChessCom(game) ? getChessComResult(game) : getLichessResult(game);

  const timeClass = isChessCom(game)
    ? isChessComBotGame(game)
      ? 'bot'
      : game.time_class
    : convertLichessTimeClass(game.speed);

  const timeControl = isChessCom(game)
    ? isChessComBotGame(game)
      ? null
      : formatChessComTimeControl(game.time_control)
    : formatLichessTimeControl(game);

  const wName = isChessCom(game) ? game.white.username : getLichessUsername(game.players.white);
  const bName = isChessCom(game) ? game.black.username : getLichessUsername(game.players.black);
  const wRating = showRatings ? isChessCom(game) ? game.white.rating : getLichessRating(game.players.white) : null;
  const bRating = showRatings ? isChessCom(game) ? game.black.rating : getLichessRating(game.players.black) : null;

  return (
    <Card
      classNames={{
        base: 'text-sm border-b-1 border-default-100',
        body: 'flex-row gap-3 items-center pl-2 pr-4 py-3',
      }}
      disableAnimation
      fullWidth
      isHoverable
      isPressable
      onPress={() => {
        loadGame(game.pgn);
        submitGame(game);
      }}
      radius="none"
      shadow="none"
    >
      <CardBody>
        <div className="flex w-10 min-w-10 flex-col items-center gap-1" id="time-control">
          <TimeClass className="size-5" timeClass={timeClass} />
          <span className="text-nowrap text-xs text-foreground-500">
            {timeControl}
          </span>
        </div>
        <div className="flex flex-col gap-0.5" id="players-info">
          <div className="flex items-center gap-2">
            <span className="max-w-40 overflow-hidden truncate">{wName}</span>
            <span className="text-xs font-bold leading-4 text-foreground-500">
              {wRating}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="max-w-40 overflow-hidden truncate">{bName}</span>
            <span className="text-xs font-bold leading-4 text-foreground-500">
              {bRating}
            </span>
          </div>
        </div>
        <Result className="ml-auto size-5" result={result} />
      </CardBody>
    </Card>
  );
}
