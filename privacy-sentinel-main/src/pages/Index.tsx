import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { DashboardSection } from '@/components/DashboardSection';
import { ScanResultsSection } from '@/components/ScanResultsSection';
import { SettingsSection } from '@/components/SettingsSection';
import { AlertPopupDemo } from '@/components/AlertPopupDemo';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DashboardSection />
        <ScanResultsSection />
        <SettingsSection />
      </main>
      <Footer />
      <AlertPopupDemo />
    </div>
  );
};

export default Index;
