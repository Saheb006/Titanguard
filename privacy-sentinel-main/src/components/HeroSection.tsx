import { Shield, Eye, Cookie, Bell, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Eye, label: 'Hidden Trackers', color: 'text-primary' },
  { icon: Cookie, label: 'Cookie Patterns', color: 'text-warning' },
  { icon: Bell, label: 'Notifications', color: 'text-success' },
  { icon: AlertTriangle, label: 'Dark Patterns', color: 'text-destructive' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Browser Extension Available</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your Privacy
            <br />
            <span className="gradient-text">Guardian</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Automatically scan websites for hidden trackers, dark patterns, and privacy threats. 
            Get real-time alerts and take control of your online privacy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Install Extension
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
              View Dashboard
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card stat-card-hover"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Shield Illustration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 float-animation" />
        </div>
      </div>
    </section>
  );
}
