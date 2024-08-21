import { Accordion, AccordionItem } from '@nextui-org/accordion';

import chesscomLogo from '../icons/chesscom.png';
import lichessLogo from '../icons/lichess.png';
import pgnLogo from '../icons/pgn.png';
import ChessSiteForm from './ChessSiteForm';
import PGNForm from './PGNForm';

export default function Forms() {
  return (
    <Accordion
      defaultExpandedKeys={['chess.com']}
      isCompact
    >
      <AccordionItem
        aria-label="Load from chess.com"
        key="chess.com"
        startContent={<img className="size-4" src={chesscomLogo} />}
        title="chess.com"
      >
        <ChessSiteForm site="chess.com" />
      </AccordionItem>
      <AccordionItem
        aria-label="Load from lichess"
        key="lichess"
        startContent={<img className="size-4" src={lichessLogo} />}
        title="lichess"
      >
        <ChessSiteForm site="lichess" />
      </AccordionItem>
      <AccordionItem
        aria-label="PGN"
        key="pgn"
        startContent={<img className="size-4" src={pgnLogo} />}
        title="PGN"
      >
        <PGNForm />
      </AccordionItem>
    </Accordion>
  );
}
