import { useQuery } from '@tanstack/react-query';

export default function useStockfish() {
  return useQuery({
    queryKey: ['stockfish'],
    queryFn: fetchStockfish,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 0,
  });
}

function fetchStockfish(): Promise<Worker> {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  return Stockfish();
}
