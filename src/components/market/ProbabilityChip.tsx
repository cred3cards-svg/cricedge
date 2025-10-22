import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatPercentage } from '@/lib/utils';

type ProbabilityChipProps = {
  probability: number;
  side: 'YES' | 'NO';
  className?: string;
};

export default function ProbabilityChip({ probability, side, className }: ProbabilityChipProps) {
  const bgColor = side === 'YES' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-pink-100 dark:bg-pink-900';
  const textColor = side === 'YES' ? 'text-blue-800 dark:text-blue-200' : 'text-pink-800 dark:text-pink-200';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant="outline" className={cn('border-transparent font-bold text-sm', bgColor, textColor)}>
        {formatPercentage(probability)}
      </Badge>
    </div>
  );
}
