import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Select, SelectItem } from '@heroui/select';
import { Switch } from '@heroui/switch';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';

import { useSettingsStore } from '../../stores/useSettingsStore';
import capitalize from '../../utils/capitalize';

import type { Board, Pieces } from '../../stores/useSettingsStore';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { showRatings, pieces, board } = useSettingsStore(state => state.settings);
  const toggleShowRatings = useSettingsStore(state => state.toggleShowRatings);
  const choosePieces = useSettingsStore(state => state.choosePieces);
  const chooseBoard = useSettingsStore(state => state.chooseBoard);

  return (
    <Popover
      classNames={{ content: 'w-52' }}
      isOpen={isOpen}
      onOpenChange={open => setIsOpen(open)}
      placement="top-end"
    >
      <PopoverTrigger>
        <Button
          aria-label="Settings Popover"
          className="ml-auto text-2xl"
          isIconOnly
          radius="sm"
          size="sm"
          variant="flat"
        >
          <Icon
            className="transition-transform"
            icon="material-symbols:settings"
            style={{
              transform: `rotate(${isOpen ? '-30deg' : '0'})`,
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex w-full flex-col gap-3 px-2 py-4">
          <Switch
            isSelected={showRatings}
            onValueChange={toggleShowRatings}
            size="sm"
          >
            Show Ratings
          </Switch>
          <Select
            label="Pieces"
            onSelectionChange={(key) => {
              for (const entry of key) {
                choosePieces(entry as Pieces);
              }
            }}
            selectedKeys={[pieces]}
            size="sm"
          >
            {['neo', 'classic', 'ocean'].map(pieces => (
              <SelectItem
                key={pieces}
                startContent={(
                  <img className="size-10" src={`/pieces/${pieces}/wn.png`} />
                )}
              >
                {capitalize(pieces)}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Board"
            onSelectionChange={(key) => {
              for (const entry of key) {
                chooseBoard(entry as Board);
              }
            }}
            selectedKeys={[board]}
            size="sm"
          >
            {['green', 'brown', 'ice'].map(board => (
              <SelectItem
                key={board}
                startContent={(
                  <div
                    className="size-10"
                    style={{
                      backgroundImage: `url("/boards/${board}.png")`,
                      backgroundSize: '400%',
                    }}
                  />
                )}
              >
                {capitalize(board)}
              </SelectItem>
            ))}
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
