import { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ExternalLink, ChevronDown, ChevronUp, Eye, Cookie, Bell, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScanResult {
  id: string;
  url: string;
  domain: string;
  timestamp: string;
  score: number;
  status: 'safe' | 'warning' | 'danger';
  issues: {
    type: 'tracker' | 'dark-pattern' | 'notification' | 'privacy-policy';
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
  }[];
}

const mockResults: ScanResult[] = [
  {
    id: '1',
    url: 'https://example-shop.com/products',
    domain: 'example-shop.com',
    timestamp: '2 min ago',
    score: 34,
    status: 'danger',
    issues: [
      { type: 'tracker', severity: 'high', title: '12 Hidden Trackers', description: 'Facebook Pixel, Google Analytics, TikTok Pixel, and 9 others tracking your behavior.' },
      { type: 'dark-pattern', severity: 'high', title: 'Manipulative Cookie Banner', description: 'Accept button is prominently displayed while reject is hidden and requires multiple clicks.' },
      { type: 'notification', severity: 'medium', title: 'Aggressive Push Notifications', description: 'Site requests notification permissions immediately on page load.' },
    ],
  },
  {
    id: '2',
    url: 'https://news-daily.net/article/12345',
    domain: 'news-daily.net',
    timestamp: '15 min ago',
    score: 56,
    status: 'warning',
    issues: [
      { type: 'tracker', severity: 'medium', title: '5 Analytics Trackers', description: 'Standard analytics trackers detected including Google Analytics.' },
      { type: 'privacy-policy', severity: 'medium', title: 'Vague Privacy Policy', description: 'Privacy policy contains unclear language about data sharing with third parties.' },
    ],
  },
  {
    id: '3',
    url: 'https://secure-bank.com/login',
    domain: 'secure-bank.com',
    timestamp: '1 hour ago',
    score: 92,
    status: 'safe',
    issues: [
      { type: 'tracker', severity: 'low', title: '1 Essential Cookie', description: 'Session management cookie required for authentication.' },
    ],
  },
];

const issueIcons = {
  'tracker': Eye,
  'dark-pattern': AlertTriangle,
  'notification': Bell,
  'privacy-policy': FileText,
};

export function ScanResultsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'safe':
        return { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', icon: CheckCircle2 };
      case 'warning':
        return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: AlertTriangle };
      case 'danger':
        return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', icon: XCircle };
      default:
        return { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground', icon: CheckCircle2 };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <section id="scans" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Recent Scan Results</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detailed analysis of websites you've visited. Click on any result to see the full breakdown of privacy concerns.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {mockResults.map((result) => {
            const styles = getStatusStyles(result.status);
            const StatusIcon = styles.icon;
            const isExpanded = expandedId === result.id;

            return (
              <div
                key={result.id}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300",
                  isExpanded && "ring-1 ring-primary/30"
                )}
              >
                {/* Header */}
                <div
                  className="p-4 sm:p-6 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : result.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Score Badge */}
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0",
                        styles.bg, styles.border, "border"
                      )}>
                        <span className={cn("text-lg font-bold font-mono", styles.text)}>
                          {result.score}
                        </span>
                        <span className="text-[10px] text-muted-foreground">score</span>
                      </div>

                      {/* Domain Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn("w-4 h-4 shrink-0", styles.text)} />
                          <h3 className="font-semibold truncate">{result.domain}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono truncate mt-1">
                          {result.url}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{result.timestamp}</p>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "hidden sm:inline-flex text-xs px-3 py-1 rounded-full font-medium capitalize",
                        styles.bg, styles.text
                      )}>
                        {result.status}
                      </span>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-border/50 animate-fade-in">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">
                      Issues Found ({result.issues.length})
                    </h4>
                    <div className="space-y-3">
                      {result.issues.map((issue, i) => {
                        const IssueIcon = issueIcons[issue.type];
                        return (
                          <div key={i} className="p-4 rounded-lg bg-muted/50">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                                <IssueIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-sm">{issue.title}</h5>
                                  <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase",
                                    getSeverityColor(issue.severity)
                                  )}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{issue.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="w-3 h-3" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
