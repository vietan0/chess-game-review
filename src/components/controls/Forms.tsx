import { Accordion, AccordionItem } from '@heroui/react';

import useLocalStorage from '../../hooks/useLocalStorage';
import ChessCom from '../../icons/game-src/ChessCom';
import Lichess from '../../icons/game-src/Lichess';
import Pgn from '../../icons/game-src/Pgn';
import ChessSiteForm from './ChessSiteForm';
import PGNForm from './PGNForm';

export default function Forms() {
  const { item: gameInput, set } = useLocalStorage('game-input');

  return (
    <Accordion
      defaultExpandedKeys={[gameInput || '']}
      isCompact
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        set('game-input', selected || '');
      }}
    >
      <AccordionItem
        aria-label="Load from chess.com"
        key="chess.com"
        startContent={<ChessCom className="size-4" />}
        title="chess.com"
      >
        <ChessSiteForm site="chess.com" />
      </AccordionItem>
      <AccordionItem
        aria-label="Load from lichess"
        key="lichess"
        startContent={<Lichess className="size-4" />}
        title="lichess"
      >
        <ChessSiteForm site="lichess" />
      </AccordionItem>
      <AccordionItem
        aria-label="PGN"
        key="pgn"
        startContent={<Pgn className="size-4" />}
        title="PGN"
      >
        <PGNForm />
      </AccordionItem>
    </Accordion>
  );
}
