import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';

import useGameArchives from '../queries/useGameArchives';
import { useSelectGameStore } from '../useSelectGameStore';

export default function Months() {
  const username = useSelectGameStore(state => state.username)!;
  const site = useSelectGameStore(state => state.site)!;
  const toSelectGame = useSelectGameStore(state => state.toSelectGame);
  const reset = useSelectGameStore(state => state.reset);
  const { data } = useGameArchives(username, site);

  return (
    <>
      <Button
        aria-label="Back"
        className="grow text-3xl"
        disableRipple
        isIconOnly
        onPress={reset}
        radius="sm"
        variant="light"
      >
        <Icon icon="material-symbols:chevron-left-rounded" />
      </Button>
      {data?.map(link => (
        <Button
          className="mb-1 block"
          key={link}
          onPress={() => toSelectGame(link)}
          radius="sm"
          variant="flat"
        >
          {link.slice(-7)}
        </Button>
      ))}
    </>
  );
}
