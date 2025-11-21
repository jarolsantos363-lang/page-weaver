import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

let deferredPrompt: any = null;

export const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    deferredPrompt = null;
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm z-50"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-muted rounded transition-smooth"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                Instalar aplicación
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Instala esta app para acceder rápidamente y trabajar sin conexión.
              </p>
              
              <Button
                onClick={handleInstall}
                size="sm"
                className="w-full"
              >
                Instalar ahora
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
