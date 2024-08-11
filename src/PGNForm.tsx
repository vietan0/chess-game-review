import { DevTool } from '@hookform/devtools';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Textarea } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';

import { useStore } from './store';

import type { SubmitHandler } from 'react-hook-form';

interface Inputs {
  pgn: string;
}

const samplePgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.08.09"]
[Round "-"]
[White "vietan0"]
[Black "CringeClaw"]
[Result "0-1"]
[CurrentPosition "3R3r/2p1kpp1/Q3p3/P3P3/8/2P2q2/5P1p/R6K w - -"]
[Timezone "UTC"]
[ECO "B02"]
[ECOUrl "https://www.chess.com/openings/Alekhines-Defense-Scandinavian-Variation-3.exd5"]
[UTCDate "2024.08.09"]
[UTCTime "12:48:30"]
[WhiteElo "1173"]
[BlackElo "1080"]
[TimeControl "600+5"]
[Termination "CringeClaw won by checkmate"]
[StartTime "12:48:30"]
[EndDate "2024.08.09"]
[EndTime "13:08:56"]
[Link "https://www.chess.com/game/live/116946634111"]
[WhiteUrl "https://images.chesscomfiles.com/uploads/v1/user/360563035.05ff67e5.50x50o.709eaa7ed807.jpg"]
[WhiteCountry "149"]
[WhiteTitle "GM"]
[BlackUrl "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif"]
[BlackCountry "40"]
[BlackTitle "FM"]

1. e4 {[%clk 0:10:01.7]} 1... d5 {[%clk 0:10:02.2]} 2. exd5 {[%clk 0:10:04]}
2... Nf6 {[%clk 0:10:06.5]} 3. Nc3 {[%clk 0:10:02.3]} 3... Nxd5 {[%clk
0:10:10.3]} 4. Nxd5 {[%clk 0:10:00.3]} 4... Qxd5 {[%clk 0:10:14.4]} 5. d4 {[%clk
0:09:58.7]} 5... Nc6 {[%clk 0:10:17.9]} 6. Nf3 {[%clk 0:09:58.9]} 6... Bf5
{[%clk 0:10:14.1]} 7. Bd3 $2 {[%clk 0:09:01.5]} 7... O-O-O $9 {[%clk 0:09:27.2]} 8.
Bxf5+ $9 {[%clk 0:07:44.3]} 8... Qxf5 {[%clk 0:09:30.2]} 9. O-O {[%clk
0:07:36.2]} 9... Nb4 $2 {[%clk 0:09:30.1]} 10. c3 {[%clk 0:05:16.2]} 10... Nd3 $6
{[%clk 0:07:57]} 11. Qe2 {[%clk 0:04:51.6]} 11... Nf4 $2 {[%clk 0:06:16.1]} 12.
Bxf4 $9 {[%clk 0:04:53.1]} 12... Qxf4 {[%clk 0:06:19.9]} 13. Ne5 $6 {[%clk
0:04:00.8]} 13... e6 {[%clk 0:05:58.8]} 14. a4 {[%clk 0:03:11.4]} 14... Bd6
{[%clk 0:05:58.2]} 15. Nf3 {[%clk 0:01:43.3]} 15... h6 {[%clk 0:05:41.9]} 16. g3
{[%clk 0:01:06.6]} 16... Qg4 {[%clk 0:05:15]} 17. a5 {[%clk 0:01:02.7]} 17... a6
{[%clk 0:05:16.1]} 18. b4 {[%clk 0:00:52.5]} 18... h5 {[%clk 0:04:43.2]} 19. b5
{[%clk 0:00:30.3]} 19... h4 $2 {[%clk 0:04:44.4]} 20. bxa6 {[%clk 0:00:31.3]}
20... bxa6 {[%clk 0:04:18]} 21. Qxa6+ {[%clk 0:00:26.7]} 21... Kd7 {[%clk
0:04:22]} 22. Ne5+ $6 {[%clk 0:00:24.8]} 22... Bxe5 $1 {[%clk 0:04:24.3]} 23. dxe5
{[%clk 0:00:29.7]} 23... hxg3 {[%clk 0:04:21.8]} 24. Rfd1+ $9 {[%clk 0:00:22.7]}
24... Ke7 $1 {[%clk 0:04:19.1]} 25. Rxd8 $2 {[%clk 0:00:13]} 25... gxh2+ {[%clk
0:04:18.9]} 26. Kh1 {[%clk 0:00:12.5]} 26... Qf3# {[%clk 0:03:55.3]} 0-1`;

export default function PGNForm({ setRandomState }: {
  setRandomState: React.Dispatch<React.SetStateAction<number>>;
}) {
  const currentGame = useStore(state => state.currentGame);

  const {
    handleSubmit,
    control,
  } = useForm<Inputs>({
    defaultValues: {
      pgn: samplePgn,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    currentGame.loadPgn(data.pgn);
    setRandomState(Math.random());
  };

  return (
    <Card classNames={{ base: 'bg-content2' }} fullWidth shadow="none">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>Game Input</CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <Controller
            control={control}
            name="pgn"
            render={({ field }) => (
              <Textarea
                label="PGN"
                maxRows={3}
                minRows={1}
                placeholder="Paste PGN here"
                {...field}
              />
            )}
          />
        </CardBody>
        <CardFooter>
          <Button color="primary" fullWidth type="submit">Submit PGN</Button>
        </CardFooter>
      </form>
      <DevTool control={control} />
    </Card>
  );
}
