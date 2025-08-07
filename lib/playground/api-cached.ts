/**
 * Cached Playground API
 * 
 * Adds caching layer to the playground API for improved performance
 */

import { withCache, CacheStrategies, dedupRequest, apiCache } from '@/lib/cache';
import { generatePlaygroundResponse as originalGeneratePlaygroundResponse, PlaygroundRequest, PlaygroundResponse } from './api';

// Create cache key from request
const createCacheKey = (request: PlaygroundRequest): string => {
  return `${request.provider}-${request.modelId}-${request.input.substring(0, 100)}-${request.temperature}-${request.maxTokens}`;
};

// Cached version of generatePlaygroundResponse
export const generatePlaygroundResponse = withCache(
  async (request: PlaygroundRequest): Promise<PlaygroundResponse> => {
    // Use deduplication for identical concurrent requests
    const dedupKey = `playground:${createCacheKey(request)}`;
    
    return dedupRequest(dedupKey, () => 
      originalGeneratePlaygroundResponse(request)
    );
  },
  {
    ttl: CacheStrategies.SHORT, // 30 seconds cache for API responses
    keyGenerator: (request) => createCacheKey(request)
  }
);

// Cache management utilities
export const playgroundCache = {
  // Clear all playground cache
  clear: () => {
    apiCache.clear();
  },
  
  // Get cache size
  size: () => {
    return apiCache.size();
  },
  
  // Preload common responses
  preload: async (requests: PlaygroundRequest[]) => {
    const promises = requests.map(request => 
      generatePlaygroundResponse(request).catch(err => 
        console.error('Preload error:', err)
      )
    );
    
    await Promise.all(promises);
  }
};

// Export everything from original API
export * from './api';