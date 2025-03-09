import { CircularProgress } from '@heroui/progress';

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
