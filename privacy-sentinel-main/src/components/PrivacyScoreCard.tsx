import { cn } from '@/lib/utils';

interface PrivacyScoreCardProps {
  score: number;
  label: string;
  className?: string;
}

export function PrivacyScoreCard({ score, label, className }: PrivacyScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { ring: 'stroke-success', text: 'text-success', glow: 'glow-safe' };
    if (score >= 50) return { ring: 'stroke-warning', text: 'text-warning', glow: 'glow-warning' };
    return { ring: 'stroke-destructive', text: 'text-destructive', glow: 'glow-danger' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Secure';
    if (score >= 50) return 'Moderate';
    return 'At Risk';
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const progress = ((100 - score) / 100) * circumference;

  return (
    <div className={cn("glass-card-elevated p-6 text-center", colors.glow, className)}>
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn(colors.ring, "transition-all duration-1000 ease-out")}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold font-mono", colors.text)}>{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-1">{label}</h3>
      <p className={cn("text-sm font-medium", colors.text)}>{getScoreLabel(score)}</p>
    </div>
  );
}
