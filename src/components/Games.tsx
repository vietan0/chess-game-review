import useMonthlyArchives from '../queries/useMonthlyArchives';
import { useSelectGameStore } from '../useSelectGameStore';
import Game from './Game';

export default function Games() {
  const monthLink = useSelectGameStore(state => state.monthLink);
  const { data } = useMonthlyArchives(monthLink!);

  return (
    <>
      {data?.map(game => <Game game={game} key={game.uuid} />)}
    </>
  );
}
