"use client";
import { useEffect, useState, useCallback, useRef } from 'react';

interface EmailGateProps {
  onAccessGranted: () => void;
}

export function EmailGate({ onAccessGranted }: EmailGateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const hasGrantedAccess = useRef(false);
  const formSubmitted = useRef(false);

  const grantAccess = useCallback(() => {
    if (hasGrantedAccess.current) return;
    hasGrantedAccess.current = true;
    localStorage.setItem('roi-email-submitted', 'true');
    onAccessGranted();
  }, [onAccessGranted]);

  const showButton = useCallback(() => {
    if (formSubmitted.current) return;
    formSubmitted.current = true;
    setShowContinueButton(true);
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="hsforms"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.hsforms.net/forms/embed/23263384.js';
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'hsFormCallback') {
        if (data.eventName === 'onFormSubmitted' || data.eventName === 'onFormSubmit') { showButton(); return; }
      }
      if (data.eventName === 'onFormSubmitted' || data.eventName === 'onFormSubmit') { showButton(); return; }
      if (data.data?.eventName === 'onFormSubmitted') { showButton(); return; }
      if (data.meetingBookSucceeded || data.formSubmitted) { showButton(); return; }
    };
    window.addEventListener('message', handleMessage);

    let formLoaded = false;
    let initialIframeHeight = 0;
    let stableHeightCount = 0;

    const pollInterval = setInterval(() => {
      const container = document.querySelector('.hs-form-frame');
      if (!container) return;
      const iframes = container.querySelectorAll('iframe');
      if (iframes.length === 0) return;
      const iframe = iframes[0] as HTMLIFrameElement;
      const currentHeight = iframe.offsetHeight || iframe.clientHeight;
      if (!formLoaded) {
        if (currentHeight > 100) { stableHeightCount++; if (stableHeightCount >= 3) { formLoaded = true; initialIframeHeight = currentHeight; } }
        return;
      }
      const heightRatio = currentHeight / initialIframeHeight;
      if ((initialIframeHeight - currentHeight) > 100 || heightRatio < 0.7 || heightRatio > 1.5) {
        showButton();
        clearInterval(pollInterval);
      }
    }, 500);

    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => { window.removeEventListener('message', handleMessage); clearInterval(pollInterval); clearTimeout(timer); };
  }, [grantAccess, showButton]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--roi-bg-primary)' }}>
      <div className="w-full max-w-md mx-4">
        <div className="roi-card p-6 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[var(--roi-text-primary)]">ROI Projection Tool</h1>
            <p className="text-sm text-[var(--roi-text-secondary)]">Enter your email to access the calculator</p>
          </div>
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[var(--roi-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className={`hs-form-frame ${isLoading ? 'opacity-0 h-0' : 'opacity-100'}`} data-region="na1" data-form-id="c9d70c3d-fbd8-4fc2-af23-4ada6c298020" data-portal-id="23263384" />
          <p className="text-xs text-[var(--roi-text-muted)] text-center">We respect your privacy. Your information will not be shared.</p>
          {showContinueButton && (
            <button onClick={grantAccess} className="w-full py-3 px-4 bg-[var(--roi-accent)] hover:opacity-90 text-white font-medium rounded-lg transition-colors">
              Continue to Calculator &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
