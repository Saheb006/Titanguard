import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatsCard({ icon: Icon, label, value, change, changeType = 'neutral', className }: StatsCardProps) {
  return (
    <div className={cn("glass-card p-5 stat-card-hover", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            changeType === 'positive' && "bg-success/10 text-success",
            changeType === 'negative' && "bg-destructive/10 text-destructive",
            changeType === 'neutral' && "bg-muted text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold font-mono mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
