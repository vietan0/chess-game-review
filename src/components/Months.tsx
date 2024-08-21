import { Button } from '@nextui-org/button';

import useGameArchives from '../queries/useGameArchives';
import { useSelectGameStore } from '../useSelectGameStore';

export default function Months() {
  const username = useSelectGameStore(state => state.username)!;
  const site = useSelectGameStore(state => state.site)!;
  const toSelectGame = useSelectGameStore(state => state.toSelectGame);
  const { data } = useGameArchives(username, site);

  return (
    <>
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
