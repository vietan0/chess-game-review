import { Button } from '@nextui-org/button';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import { nanoid } from 'nanoid';

import useGameArchives from '../queries/useGameArchives';
import { useSelectGameStore } from '../useSelectGameStore';
import cn from '../utils/cn';
import Loading from './Loading';

dayjs.extend(objectSupport);

export default function Months() {
  const username = useSelectGameStore(state => state.username)!;
  const site = useSelectGameStore(state => state.site)!;
  const toSelectGame = useSelectGameStore(state => state.submitMonth);
  const { data, isLoading, error } = useGameArchives(username, site);
  if (isLoading)
    return <Loading />;
  if (error)
    return 'Error with Query';

  return (
    <>
      {data!.map((yearArr, i) => {
        const year = Number(yearArr[0].slice(-7, -3)); // 2024

        return (
          <div key={nanoid()}>
            <p className={cn('mb-2 font-bold', i !== 0 && 'mt-4')}>{year}</p>
            <div className="grid grid-cols-[repeat(4,_minmax(64px,_1fr))] gap-1" id="month-grid">
              {yearArr.map((link) => {
                const month = Number(link.slice(-2)); // 01

                return (
                  <Button
                    className="mb-1 mr-1 inline-block min-w-16"
                    key={link}
                    onPress={() => toSelectGame(link)}
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
