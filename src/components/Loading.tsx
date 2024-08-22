import { CircularProgress } from '@nextui-org/progress';

export default function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <CircularProgress aria-label="Loading..." size="sm" />
    </div>
  );
}
