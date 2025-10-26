import { useState, useEffect } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* App Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-r from-primary to-accent shadow-2xl">
            <span className="font-heading text-4xl font-bold text-white">T</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 font-heading text-4xl font-bold">
          Install <span className="text-gradient">Tradia</span>
        </h1>

        {isInstalled ? (
          <div className="glass-morphism rounded-3xl p-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <Check className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">App Installed!</h2>
            <p className="mb-6 text-muted-foreground">
              Tradia is now installed on your device. You can find it on your home screen.
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-white"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-lg text-muted-foreground">
              Get the full app experience with offline access, faster loading, and more.
            </p>

            {/* Features */}
            <div className="mb-8 space-y-4">
              {[
                { icon: Smartphone, text: 'Works like a native app' },
                { icon: Download, text: 'No app store needed' },
                { icon: Check, text: 'Offline access' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-morphism flex items-center gap-4 rounded-2xl p-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">{feature.text}</p>
                </div>
              ))}
            </div>

            {/* Install Button */}
            {isInstallable ? (
              <Button
                onClick={handleInstall}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-[var(--shadow-premium)]"
              >
                <Download className="mr-2 h-5 w-5" />
                Install App
              </Button>
            ) : (
              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="mb-2 font-semibold">How to Install</h3>
                <div className="space-y-2 text-left text-sm text-muted-foreground">
                  <p>
                    <strong>On iPhone:</strong> Tap the Share button in Safari, then
                    "Add to Home Screen"
                  </p>
                  <p>
                    <strong>On Android:</strong> Tap the menu button in Chrome, then
                    "Add to Home Screen" or "Install App"
                  </p>
                </div>
              </div>
            )}

            <Link to="/" className="mt-6 block">
              <Button variant="ghost" className="w-full">
                Maybe Later
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Install;
