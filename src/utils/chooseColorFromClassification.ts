import type { Classification } from './classify';

export function chooseTextColor(classification: Classification) {
  switch (classification) {
    case 'best':
      return 'text-best';

    case 'excellent':
      return 'text-excellent';

    case 'good':
      return 'text-good';

    case 'inaccuracy':
      return 'text-inaccuracy';

    case 'mistake':
      return 'text-mistake';

    case 'blunder':
      return 'text-blunder';

    case 'book':
      return 'text-book';

    case 'forced':
      return 'text-forced';

    default:
      return 'text-foreground';
  }
}

export function chooseHighlightColor(classification: Classification) {
  switch (classification) {
    case 'best':
      return 'bg-best/50';

    case 'excellent':
      return 'bg-excellent/50';

    case 'good':
      return 'bg-good/50';

    case 'inaccuracy':
      return 'bg-inaccuracy/50';

    case 'mistake':
      return 'bg-mistake/50';

    case 'blunder':
      return 'bg-blunder/50';

    case 'book':
      return 'bg-book/50';

    case 'forced':
      return 'bg-highlight/50';

    default:
      return 'bg-highlight/50';
  }
}

export function chooseStrokeColor(classification: Classification) {
  switch (classification) {
    case 'best':
      return 'stroke-best';

    case 'excellent':
      return 'stroke-excellent';

    case 'good':
      return 'stroke-good';

    case 'inaccuracy':
      return 'stroke-inaccuracy';

    case 'mistake':
      return 'stroke-mistake';

    case 'blunder':
      return 'stroke-blunder';

    case 'book':
      return 'stroke-book';

    case 'forced':
      return 'stroke-forced';

    default:
      return 'stroke-white';
  }
}

export function chooseFillColor(classification: Classification) {
  switch (classification) {
    case 'best':
      return 'fill-best';

    case 'excellent':
      return 'fill-excellent';

    case 'good':
      return 'fill-good';

    case 'inaccuracy':
      return 'fill-inaccuracy';

    case 'mistake':
      return 'fill-mistake';

    case 'blunder':
      return 'fill-blunder';

    case 'book':
      return 'fill-book';

    case 'forced':
      return 'fill-forced';

    default:
      return 'fill-white';
  }
}
