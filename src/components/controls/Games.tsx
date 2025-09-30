import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Result from '../../icons/result/Result';
import TimeClass from '../../icons/time-class/TimeClass';
import useMonthlyArchives from '../../queries/useMonthlyArchives';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import capitalize from '../../utils/capitalize';
import convertLichessTimeClass from '../../utils/convertLichessTimeClass';
import getChessComResult from '../../utils/getChessComResult';
import getLichessResult from '../../utils/getLichessResult';
import isChessCom from '../../utils/isChessCom';
import isChessComBotGame from '../../utils/isChessComBotGame';
import isLichessAI from '../../utils/isLichessAI';
import isLichessBotGame from '../../utils/isLichessBotGame';
import Loading from '../Loading';
import Game from './Game';

import type { TimeClassType } from '../../icons/time-class/TimeClass';
import type { Color } from 'chess.js';
import type { SubmitHandler } from 'react-hook-form';

interface Inputs {
  opponent: string;
  result: 'win' | 'lose' | 'draw';
  color: Color;
  timeClass: TimeClassType;
}

export default function Games() {
  const username = useSelectGameStore(state => state.username)!;
  const monthLink = useSelectGameStore(state => state.monthLink);
  const { data: games, isLoading, error } = useMonthlyArchives(monthLink!);
  const [filtered, setFiltered] = useState(games);

  useEffect(() => {
    setFiltered(games);
  }, [games]);

  const {
    handleSubmit,
    control,
    formState,
    reset,
  } = useForm<Inputs>({ defaultValues: {
    opponent: '',
    result: undefined,
    color: undefined,
    timeClass: undefined,
  } });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setFiltered(() => {
      if (!games)
        return undefined;

      if (games.every(game => isChessCom(game))) {
        // chess.com games
        return games.filter((game) => {
          const oppFilter = (game.white.username === username && game.black.username.toLowerCase().includes(data.opponent.toLowerCase()))
            || (game.white.username.toLowerCase().includes(data.opponent.toLowerCase()) && game.black.username === username);

          const result = getChessComResult(username, game);
          const resultFilter = data.result ? result === data.result : true;

          const colorFilter = data.color === 'w'
            ? game.white.username === username
            : data.color === 'b'
              ? game.black.username === username
              : true;

          const timeClassFilter = data.timeClass
            ? data.timeClass === 'bot'
              ? isChessComBotGame(game)
              : game.time_class === data.timeClass
            : true;

          return oppFilter && resultFilter && colorFilter && timeClassFilter;
        });
      }
      else {
        // lichess games
        return games.filter((game) => {
          const oppFilter = data.opponent
            ? !isLichessAI(game.players.white)
            && !isLichessAI(game.players.black)
            && ((game.players.white.user.name === username && game.players.black.user.name.includes(data.opponent))
            || (game.players.white.user.name.includes(data.opponent) && game.players.black.user.name === username))
            : true;

          const result = getLichessResult(username, game);
          const resultFilter = data.result ? result === data.result : true;

          const colorFilter = data.color === 'w'
            ? !isLichessAI(game.players.white) && game.players.white.user.name === username
            : data.color === 'b'
              ? !isLichessAI(game.players.black) && game.players.black.user.name === username
              : true;

          const timeClassFilter = data.timeClass
            ? data.timeClass === 'bot'
              ? isLichessBotGame(game)
              : convertLichessTimeClass(game.speed) === data.timeClass
            : true;

          return oppFilter && resultFilter && colorFilter && timeClassFilter;
        },
        );
      }
    });
  };

  if (isLoading)
    return <Loading label="Fetching games…" />;

  if (error)
    return 'Error with Query';

  return (
    <div className="flex max-h-full flex-col gap-2 overflow-y-scroll" id="Games">
      <Accordion
        className="mb-0 rounded-small"
        isCompact
        variant="bordered"
      >
        <AccordionItem
          aria-label="Filter"
          classNames={{
            content: 'pb-3',
            title: 'text-sm',
          }}
          key="filter"
          title="Filter"
        >
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="opponent"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Opponent"
                  size="sm"
                />
              )}
            />
            <div className="flex gap-2">
              <Controller
                control={control}
                name="result"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Result"
                    selectedKeys={[field.value]}
                    selectionMode="single"
                    size="sm"
                  >
                    {['win', 'lose', 'draw'].map(result => (
                      <SelectItem
                        key={result}
                        startContent={<Result className="size-5" result={result as 'win' | 'lose' | 'draw'} />}
                      >
                        {capitalize(result)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="color"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Color"
                    selectedKeys={[field.value]}
                    selectionMode="single"
                    size="sm"
                  >
                    {['w', 'b'].map(color => (
                      <SelectItem key={color}>{color === 'w' ? 'White' : 'Black'}</SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="timeClass"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Time Class"
                    selectedKeys={[field.value]}
                    selectionMode="single"
                    size="sm"
                  >
                    {['bullet', 'blitz', 'rapid', 'daily', 'bot'].map(tc => (
                      <SelectItem
                        key={tc}
                        startContent={<TimeClass className="size-5" timeClass={tc as TimeClassType} />}
                      >
                        {capitalize(tc)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="text-shadow-xs"
                color="primary"
                isDisabled={!formState.isValid}
                radius="sm"
                size="sm"
                type="submit"
              >
                Filter
              </Button>
              <Button
                fullWidth={false}
                onPress={() => {
                  reset();
                  setFiltered(games);
                }}
                radius="sm"
                size="sm"
              >
                Reset
              </Button>
            </div>
          </form>
        </AccordionItem>
      </Accordion>
      <div className="min-h-0 overflow-y-scroll">
        {
          filtered
            ? filtered.length > 0
              ? filtered.map(game => <Game game={game} key={isChessCom(game) ? game.uuid : game.id} />)
              : <p className="text-center text-sm">No games found.</p>
            : null
        }
      </div>
    </div>
  );
}
