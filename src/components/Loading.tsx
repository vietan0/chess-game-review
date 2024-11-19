import { CircularProgress } from '@nextui-org/progress';

export default function Loading({ label }: { label?: string }) {
  return (
    <div className="flex size-full items-center justify-center">
      <CircularProgress
        aria-label={label ?? 'Loading…'}
        classNames={{ label: 'animate-pulse' }}
        label={label}
        size="sm"
      />
    </div>
  );
}
