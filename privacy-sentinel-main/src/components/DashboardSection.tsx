import { Globe, ShieldAlert, Eye, Cookie, TrendingUp } from 'lucide-react';
import { PrivacyScoreCard } from './PrivacyScoreCard';
import { StatsCard } from './StatsCard';

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor your browsing privacy in real-time. View comprehensive statistics and insights about the websites you visit.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Privacy Score - Large Card */}
          <div className="lg:col-span-1 lg:row-span-2">
            <PrivacyScoreCard score={78} label="Overall Privacy Score" className="h-full" />
          </div>

          {/* Stats Cards */}
          <StatsCard
            icon={Globe}
            label="Sites Scanned Today"
            value={127}
            change="+12%"
            changeType="positive"
          />
          <StatsCard
            icon={ShieldAlert}
            label="Threats Blocked"
            value={43}
            change="+8"
            changeType="negative"
          />
          <StatsCard
            icon={Eye}
            label="Trackers Detected"
            value={89}
            change="-5%"
            changeType="positive"
          />
          <StatsCard
            icon={Cookie}
            label="Dark Patterns Found"
            value={12}
          />
          <StatsCard
            icon={TrendingUp}
            label="Safe Sites Ratio"
            value="73%"
            change="+3%"
            changeType="positive"
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trackers Breakdown */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Tracker Types
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Analytics', count: 34, color: 'bg-primary' },
                { name: 'Advertising', count: 28, color: 'bg-warning' },
                { name: 'Social Media', count: 19, color: 'bg-destructive' },
                { name: 'Essential', count: 8, color: 'bg-success' },
              ].map((tracker) => (
                <div key={tracker.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{tracker.name}</span>
                    <span className="font-mono text-muted-foreground">{tracker.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(tracker.color, "h-full rounded-full transition-all duration-500")}
                      style={{ width: `${(tracker.count / 89) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Concerns */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-warning" />
              Privacy Concerns
            </h3>
            <div className="space-y-3">
              {[
                { issue: 'Cookie consent manipulation', severity: 'high', sites: 5 },
                { issue: 'Hidden newsletter signup', severity: 'medium', sites: 8 },
                { issue: 'Pre-checked consent boxes', severity: 'high', sites: 3 },
                { issue: 'Confusing opt-out process', severity: 'low', sites: 12 },
              ].map((concern, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      concern.severity === 'high' && "bg-destructive",
                      concern.severity === 'medium' && "bg-warning",
                      concern.severity === 'low' && "bg-muted-foreground"
                    )} />
                    <span className="text-sm">{concern.issue}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{concern.sites} sites</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-success" />
              Recent Scans
            </h3>
            <div className="space-y-3">
              {[
                { domain: 'example.com', score: 95, status: 'safe' },
                { domain: 'news-site.net', score: 42, status: 'warning' },
                { domain: 'shop.store', score: 78, status: 'safe' },
                { domain: 'blog.xyz', score: 23, status: 'danger' },
              ].map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono",
                      scan.status === 'safe' && "bg-success/20 text-success",
                      scan.status === 'warning' && "bg-warning/20 text-warning",
                      scan.status === 'danger' && "bg-destructive/20 text-destructive"
                    )}>
                      {scan.score}
                    </div>
                    <span className="text-sm font-mono truncate max-w-[120px]">{scan.domain}</span>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    scan.status === 'safe' && "bg-success/10 text-success",
                    scan.status === 'warning' && "bg-warning/10 text-warning",
                    scan.status === 'danger' && "bg-destructive/10 text-destructive"
                  )}>
                    {scan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
