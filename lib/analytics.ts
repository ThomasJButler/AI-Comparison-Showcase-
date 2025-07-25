type EventType = 'page_view' | 'feature_usage' | 'error' | 'performance';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  data?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private static instance: Analytics;
  private queue: AnalyticsEvent[] = [];
  private isProcessing = false;

  private constructor() {
    // Initialize analytics
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public trackEvent(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: Date.now()
    });
    this.processQueue();
  }

  public trackPageView(path: string) {
    this.trackEvent({
      type: 'page_view',
      name: path
    });
  }

  public trackFeatureUsage(feature: string, data?: Record<string, any>) {
    this.trackEvent({
      type: 'feature_usage',
      name: feature,
      data
    });
  }

  public trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent({
      type: 'error',
      name: error.name,
      data: {
        message: error.message,
        stack: error.stack,
        ...context
      }
    });
  }

  public trackPerformance(metric: string, value: number) {
    this.trackEvent({
      type: 'performance',
      name: metric,
      data: { value }
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const events = [...this.queue];
    this.queue = [];

    try {
      // In a real implementation, send to analytics service
      console.log('Analytics events:', events);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      // Re-queue failed events
      this.queue.unshift(...events);
      console.error('Failed to process analytics events:', error);
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  private async flush() {
    if (this.queue.length > 0) {
      await this.processQueue();
    }
  }
}

export const analytics = Analytics.getInstance();