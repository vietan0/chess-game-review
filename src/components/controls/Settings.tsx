import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { Select, SelectItem } from '@nextui-org/select';
import { Switch } from '@nextui-org/switch';

import { useSettingsStore } from '../../stores/useSettingsStore';

import type { Board, Pieces } from '../../stores/useSettingsStore';

export default function Settings() {
  const { showRatings, pieces, board } = useSettingsStore(state => state.settings);
  const toggleShowRatings = useSettingsStore(state => state.toggleShowRatings);
  const choosePieces = useSettingsStore(state => state.choosePieces);
  const chooseBoard = useSettingsStore(state => state.chooseBoard);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          aria-label="Settings Popover"
          className="ml-auto text-2xl"
          isIconOnly
          radius="sm"
          size="sm"
          variant="solid"
        >
          <Icon icon="material-symbols:settings-outline-rounded" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3 px-2 py-4">
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
            {['neo', 'classic', 'ocean'].map(p => (
              <SelectItem key={p}>
                {p[0].toUpperCase() + p.slice(1)}
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
            {['green', 'brown', 'ice'].map(p => (
              <SelectItem key={p}>
                {p[0].toUpperCase() + p.slice(1)}
              </SelectItem>
            ))}
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
