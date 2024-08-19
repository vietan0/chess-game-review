import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';

import chesscomLogo from '../icons/chesscom.png';
import lichessLogo from '../icons/lichess.png';
import PGNForm from './PGNForm';

export default function GameSelector() {
  return (
    <div className="flex flex-col gap-1" id="GameSelector">
      <h1 className="mb-2 text-center text-xl font-bold">Free Game Review</h1>
      <Button
        className="justify-start pr-2"
        endContent={<Icon className="ml-auto text-2xl" icon="material-symbols:chevron-right-rounded" />}
        radius="sm"
        startContent={<img className="size-4" src={chesscomLogo} />}
        variant="flat"
      >
        Load from chess.com
      </Button>
      <Button
        className="justify-start pr-2"
        endContent={<Icon className="ml-auto text-2xl" icon="material-symbols:chevron-right-rounded" />}
        radius="sm"
        startContent={<img className="size-4" src={lichessLogo} />}
        variant="flat"
      >
        Load from lichess
      </Button>
      <PGNForm />
    </div>
  );
}
