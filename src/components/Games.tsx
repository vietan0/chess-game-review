import useMonthlyArchives from '../queries/useMonthlyArchives';
import { useSelectGameStore } from '../useSelectGameStore';
import Game from './Game';
import Loading from './Loading';

export default function Games() {
  const monthLink = useSelectGameStore(state => state.monthLink);
  const { data: games, isLoading, error } = useMonthlyArchives(monthLink!);

  if (isLoading)
    return <Loading />;

  if (error)
    return 'Error with Query';

  return games!.map(game => <Game game={game} key={game.uuid} />);
}
