
/**
 * Analytics Service
 * Handles event tracking for user interactions.
 * Stores data locally for the Admin Dashboard demo.
 */

export interface AnalyticsEventProperties {
  [key: string]: any;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  properties: AnalyticsEventProperties;
  metadata: {
    timestamp: string;
    url: string;
    userAgent: string;
    userId?: string;
    userName?: string;
  };
}

const STORAGE_KEY = 'mamo_analytics_events';
const USER_KEY = 'mamo_current_user'; // Matches key in AppContext
const MAX_EVENTS = 500; // Increased limit for better reporting

export const trackEvent = (eventName: string, properties: AnalyticsEventProperties = {}) => {
  try {
    // Attempt to get current user from storage to attach to event
    let userId = undefined;
    let userName = undefined;
    try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            const user = JSON.parse(userStr);
            userId = user.id;
            userName = user.name;
        }
    } catch (e) { /* ignore */ }

    const metadata = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId,
      userName
    };

    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substr(2, 9),
      event: eventName,
      properties,
      metadata
    };

    // 1. Log to Console (Dev)
    console.groupCollapsed(`📊 Analytics: ${eventName}`);
    console.log(properties);
    console.log(metadata);
    console.groupEnd();

    // 2. Store Locally (Simulating Backend)
    const existingEventsString = localStorage.getItem(STORAGE_KEY);
    const existingEvents: AnalyticsEvent[] = existingEventsString ? JSON.parse(existingEventsString) : [];
    
    // Add new event to top, keep array size limited
    const updatedEvents = [newEvent, ...existingEvents].slice(0, MAX_EVENTS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));

  } catch (error) {
    console.error("Analytics Error:", error);
  }
};

export const getAnalyticsHistory = (): AnalyticsEvent[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const clearAnalyticsHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Generate a summary report for a specific user
export const getUserUsageReport = (userId: string) => {
    const history = getAnalyticsHistory();
    const userEvents = history.filter(e => e.metadata.userId === userId);
    
    const stats = {
        totalInteractions: userEvents.length,
        aiUsageCount: userEvents.filter(e => e.event.includes('ai_') || e.event.includes('image_')).length,
        productsViewed: userEvents.filter(e => e.event === 'product_view').length,
        cartAdditions: userEvents.filter(e => e.event === 'add_to_cart').length,
        categoriesVisited: new Set(userEvents.filter(e => e.event === 'category_select').map(e => e.properties.category_id)).size,
        lastActive: userEvents.length > 0 ? userEvents[0].metadata.timestamp : null,
        toolsUsed: {
            meter: userEvents.filter(e => e.metadata.url.includes('meter')).length > 0,
            paint: userEvents.filter(e => e.metadata.url.includes('paint')).length > 0,
            studio: userEvents.filter(e => e.metadata.url.includes('studio')).length > 0,
        }
    };

    return stats;
};
