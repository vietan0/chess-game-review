import { Button } from '@heroui/button';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import { nanoid } from 'nanoid';

import useGameArchives from '../../queries/useGameArchives';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useStageStore } from '../../stores/useStageStore';
import cn from '../../utils/cn';
import { getUnitFromLichessLink } from '../../utils/groupChessComLinksByYear';
import Loading from '../Loading';

dayjs.extend(objectSupport);

export default function Months() {
  const username = useSelectGameStore(state => state.username)!;
  const site = useSelectGameStore(state => state.site)!;
  const submitMonth = useSelectGameStore(state => state.submitMonth);
  const setStage = useStageStore(state => state.setStage);
  const { data, isLoading, error } = useGameArchives(username);
  if (isLoading)
    return <Loading label="Loading monthly collections…" />;
  if (error)
    return 'Error with Query';

  return (
    <>
      {data!.map((yearArr, i) => {
        const year = site === 'chess.com'
          ? Number(yearArr[0].slice(-7, -3))
          : getUnitFromLichessLink(yearArr[0], 'year');

        return (
          <div key={nanoid()}>
            <p className={cn('mb-2 font-bold', i !== 0 && 'mt-4')}>{year}</p>
            <div className="grid grid-cols-[repeat(4,_minmax(64px,_1fr))] gap-1" id="month-grid">
              {yearArr.map((link) => {
                const month = site === 'chess.com'
                  ? Number(link.slice(-2))
                  : getUnitFromLichessLink(link, 'month');

                return (
                  <Button
                    className="mb-1 mr-1 inline-block min-w-16"
                    key={link}
                    onPress={() => {
                      setStage('select-game');
                      submitMonth(link);
                    }}
                    radius="sm"
                    variant="ghost"
                  >
                    {dayjs({ month: month - 1 }).format('MMM')}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
