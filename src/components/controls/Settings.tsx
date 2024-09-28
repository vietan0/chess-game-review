import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Switch } from '@nextui-org/switch';

import { useSettingsStore } from '../../stores/useSettingsStore';

export default function Settings() {
  const showRatings = useSettingsStore(state => state.settings.showRatings);
  const toggleShowRatings = useSettingsStore(state => state.toggleShowRatings);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          aria-label="Settings Dropdown"
          className="ml-auto text-2xl"
          isIconOnly
          radius="sm"
          size="sm"
          variant="solid"
        >
          <Icon icon="material-symbols:settings-outline-rounded" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Settings">
        <DropdownItem
          isReadOnly
          key="show-ratings"
          startContent={(
            <Switch
              isSelected={showRatings}
              onValueChange={toggleShowRatings}
              size="sm"
            >
              Show Ratings
            </Switch>
          )}
          textValue="Show Ratings"
        >
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
