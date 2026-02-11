
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { db } from '../services/databaseService';
import { EventType, VoicePersona } from '../types';

interface AnalyticsContextType {
  trackPageView: (pageName: string) => void;
  trackClick: (buttonId: string) => void;
  trackSlider: (sliderId: string, finalValue: number) => void;
  trackARInteraction: (featureId: string, objectId: string) => void;
  trackVoiceInteraction: (persona: VoicePersona, text: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentPageRef = useRef<string | null>(null);
  const pageEnterTimeRef = useRef<number>(Date.now());

  const trackPageView = (pageName: string) => {
    const now = Date.now();
    
    if (currentPageRef.current) {
      const duration = (now - pageEnterTimeRef.current) / 1000;
      db.logEvent({
        eventType: 'DWELL_TIME',
        target: currentPageRef.current,
        value: duration
      });
    }

    currentPageRef.current = pageName;
    pageEnterTimeRef.current = now;

    db.logEvent({
      eventType: 'PAGE_VIEW',
      target: pageName
    });
  };

  const trackClick = (buttonId: string) => {
    db.logEvent({
      eventType: 'CLICK',
      target: buttonId
    });
  };

  const trackSlider = (sliderId: string, finalValue: number) => {
    db.logEvent({
      eventType: 'SLIDER_CHANGE',
      target: sliderId,
      value: finalValue
    });
  };

  const trackARInteraction = (featureId: string, objectId: string) => {
     db.logEvent({
         eventType: 'AR_INTERACTION',
         target: featureId,
         metadata: { objectId, timestamp: new Date().toISOString() }
     });
  };

  const trackVoiceInteraction = (persona: VoicePersona, text: string) => {
    db.logEvent({
      eventType: 'VOICE_INTERACTION',
      target: persona,
      value: text.length,
      metadata: { 
        text_snippet: text.substring(0, 100), // Log first 100 chars
        timestamp: new Date().toISOString() 
      }
    });
  };

  useEffect(() => {
    return () => {
      if (currentPageRef.current) {
        const duration = (Date.now() - pageEnterTimeRef.current) / 1000;
        db.logEvent({
            eventType: 'DWELL_TIME',
            target: currentPageRef.current,
            value: duration
        });
      }
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackPageView, trackClick, trackSlider, trackARInteraction, trackVoiceInteraction }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within an AnalyticsProvider');
  return context;
};

export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName]);
};

// Fix: Added missing useARTracking export
export const useARTracking = (featureId: string, isEnabled: boolean) => {
  const { trackARInteraction } = useAnalytics();
  useEffect(() => {
    if (isEnabled) {
      trackARInteraction(featureId, 'ar_mode_enabled');
    }
  }, [isEnabled, featureId, trackARInteraction]);
};
