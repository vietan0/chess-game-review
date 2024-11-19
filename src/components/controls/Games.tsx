import useMonthlyArchives from '../../queries/useMonthlyArchives';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import isChessCom from '../../utils/isChessCom';
import Loading from '../Loading';
import Game from './Game';

export default function Games() {
  const monthLink = useSelectGameStore(state => state.monthLink);
  const { data: games, isLoading, error } = useMonthlyArchives(monthLink!);

  if (isLoading)
    return <Loading label="Fetching games…" />;

  if (error)
    return 'Error with Query';

  return games!.map(game => <Game game={game} key={isChessCom(game) ? game.uuid : game.id} />);
}
