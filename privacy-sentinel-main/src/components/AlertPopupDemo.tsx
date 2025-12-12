import { useState } from 'react';
import { AlertTriangle, X, Eye, Cookie, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AlertPopupDemo() {
  const [isVisible, setIsVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50"
      >
        Show Alert Demo
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 w-80 sm:w-96 transition-all duration-300 animate-slide-in-right",
      expanded && "w-80 sm:w-[420px]"
    )}>
      <div className="glass-card-elevated overflow-hidden border-l-4 border-l-warning glow-warning">
        {/* Header */}
        <div className="p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-warning/20 text-warning">
                  MEDIUM RISK
                </span>
              </div>
              <h4 className="font-semibold mt-1">Privacy Concerns Detected</h4>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 -mt-1 -mr-1"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Score Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Privacy Score</span>
            <span className="font-mono font-bold text-warning">54/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[54%] bg-gradient-to-r from-warning to-warning/70 rounded-full" />
          </div>
        </div>

        {/* Issues Summary */}
        <div className="px-4 pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Eye className="w-4 h-4 text-destructive" />
              <span className="text-sm">7 trackers detected</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Cookie className="w-4 h-4 text-warning" />
              <span className="text-sm">Dark pattern in cookie consent</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="px-4 pb-4 pt-2 border-t border-border/50 animate-fade-in">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Detailed Analysis
            </h5>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                This website uses <span className="text-foreground font-medium">Facebook Pixel</span>, 
                <span className="text-foreground font-medium"> Google Analytics</span>, and 
                <span className="text-foreground font-medium"> 5 other trackers</span> to monitor your activity.
              </p>
              <p className="text-muted-foreground">
                The cookie consent banner uses a dark pattern: the "Reject All" option requires 3 additional clicks.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 pt-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Details'}
            <ChevronRight className={cn("w-4 h-4 ml-1 transition-transform", expanded && "rotate-90")} />
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <ExternalLink className="w-3 h-3" />
            Full Report
          </Button>
        </div>
      </div>
    </div>
  );
}
