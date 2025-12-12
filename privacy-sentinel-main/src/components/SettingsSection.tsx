import { useState } from 'react';
import { Shield, Eye, Cookie, Bell, FileText, Zap, Lock, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SettingItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  category: 'protection' | 'detection' | 'notifications';
}

const defaultSettings: SettingItem[] = [
  {
    id: 'tracker-blocking',
    icon: Eye,
    title: 'Tracker Blocking',
    description: 'Automatically block known tracking scripts and pixels',
    enabled: true,
    category: 'protection',
  },
  {
    id: 'cookie-guard',
    icon: Cookie,
    title: 'Cookie Consent Guard',
    description: 'Detect and alert about manipulative cookie consent patterns',
    enabled: true,
    category: 'detection',
  },
  {
    id: 'dark-pattern-detection',
    icon: Shield,
    title: 'Dark Pattern Detection',
    description: 'Identify and highlight deceptive UI patterns on websites',
    enabled: true,
    category: 'detection',
  },
  {
    id: 'privacy-policy-scan',
    icon: FileText,
    title: 'Privacy Policy Scanner',
    description: 'Analyze privacy policies for concerning clauses',
    enabled: false,
    category: 'detection',
  },
  {
    id: 'notification-guard',
    icon: Bell,
    title: 'Notification Request Guard',
    description: 'Block aggressive notification permission requests',
    enabled: true,
    category: 'protection',
  },
  {
    id: 'real-time-alerts',
    icon: Zap,
    title: 'Real-time Alerts',
    description: 'Show popup alerts when threats are detected',
    enabled: true,
    category: 'notifications',
  },
  {
    id: 'https-enforcement',
    icon: Lock,
    title: 'HTTPS Enforcement',
    description: 'Warn about insecure HTTP connections',
    enabled: true,
    category: 'protection',
  },
  {
    id: 'site-reputation',
    icon: Globe,
    title: 'Site Reputation Check',
    description: 'Check websites against known threat databases',
    enabled: false,
    category: 'detection',
  },
];

const categories = [
  { id: 'protection', label: 'Protection', description: 'Active protection features' },
  { id: 'detection', label: 'Detection', description: 'Passive scanning features' },
  { id: 'notifications', label: 'Notifications', description: 'Alert preferences' },
];

export function SettingsSection() {
  const [settings, setSettings] = useState(defaultSettings);

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <section id="settings" className="py-20 relative">
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Settings & Controls</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Customize your privacy protection. Enable or disable features based on your preferences.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {categories.map((category) => {
            const categorySettings = settings.filter(s => s.category === category.id);
            const enabledCount = categorySettings.filter(s => s.enabled).length;

            return (
              <div key={category.id} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {enabledCount}/{categorySettings.length} active
                  </span>
                </div>

                <div className="glass-card divide-y divide-border/50">
                  {categorySettings.map((setting) => {
                    const Icon = setting.icon;
                    return (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between p-4 sm:p-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                            setting.enabled
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{setting.title}</h4>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={() => toggleSetting(setting.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
