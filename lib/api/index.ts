/**
 * API Module Index
 * 
 * This file serves as the central export point for the API module.
 * It provides organized access to all API clients, types, and utilities.
 */

// Import API clients
import { ApiClient, type RequestOptions, type ApiError } from './apiClient';
import { OpenAIClient } from './clients/openaiClient';
import { WeatherClient } from './clients/weatherClient';
import { NewsClient } from './clients/newsClient';
import { AnthropicClient } from './clients/anthropicClient';
import { DeepSeekClient } from './clients/deepseekClient';
import { PerplexityClient } from './clients/perplexityClient';

// Base API client
export { ApiClient, type RequestOptions, type ApiError } from './apiClient';

// API Clients
export { OpenAIClient } from './clients/openaiClient';
export { WeatherClient } from './clients/weatherClient';
export { NewsClient } from './clients/newsClient';
export { AnthropicClient } from './clients/anthropicClient';
export { DeepSeekClient } from './clients/deepseekClient';
export { PerplexityClient } from './clients/perplexityClient';

// API Types
export * as OpenAITypes from './types/openai';
export * as WeatherTypes from './types/weather';
export * as NewsTypes from './types/news';
export * as AnthropicTypes from './types/anthropic';
export * as DeepSeekTypes from './types/deepseek';
export * as PerplexityTypes from './types/perplexity';

// Transformers
export * from './transformers/networkGraphData';

// API Configuration management
export interface ApiConfig {
  openai?: {
    apiKey: string;
  };
  news?: {
    apiKey: string;
  };
  anthropic?: {
    apiKey: string;
  };
  deepseek?: {
    apiKey: string;
  };
  perplexity?: {
    apiKey: string;
  };
  // Index signature for dynamic access
  [key: string]: { apiKey: string } | undefined;
}

// API Services factory class
export class ApiService {
  private static instance: ApiService;
  private config: ApiConfig;
  
  // API clients
  private openaiClient?: OpenAIClient;
  private weatherClient?: WeatherClient;
  private newsClient?: NewsClient;
  private anthropicClient?: AnthropicClient;
  private deepseekClient?: DeepSeekClient;
  private perplexityClient?: PerplexityClient;
  
  private constructor(config: ApiConfig) {
    this.config = config;
  }
  
  /**
   * Get or create the singleton instance of ApiService
   */
  public static getInstance(config?: ApiConfig): ApiService {
    if (!ApiService.instance && config) {
      ApiService.instance = new ApiService(config);
    } else if (!ApiService.instance) {
      throw new Error('ApiService must be initialized with a config first');
    }
    
    return ApiService.instance;
  }
  
  /**
   * Update the API configuration
   */
  public updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reset any clients whose configs changed
    if (config.openai) {
      this.openaiClient = undefined;
    }
    if (config.news) {
      this.newsClient = undefined;
    }
    if (config.anthropic) {
      this.anthropicClient = undefined;
    }
    if (config.deepseek) {
      this.deepseekClient = undefined;
    }
    if (config.perplexity) {
      this.perplexityClient = undefined;
    }
  }
  
  /**
   * Get the OpenAI client
   */
  public getOpenAI(): OpenAIClient {
    if (!this.openaiClient) {
      if (!this.config.openai?.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      
      this.openaiClient = new OpenAIClient(this.config.openai.apiKey);
    }
    
    return this.openaiClient;
  }
  
  /**
   * Get the Weather client
   */
  public getWeather(): WeatherClient {
    if (!this.weatherClient) {
      this.weatherClient = new WeatherClient();
    }
    
    return this.weatherClient;
  }
  
  /**
   * Get the News client
   */
  public getNews(): NewsClient {
    if (!this.newsClient) {
      if (!this.config.news?.apiKey) {
        throw new Error('News API key is not configured');
      }
      
      this.newsClient = new NewsClient(this.config.news.apiKey);
    }
    
    return this.newsClient;
  }
  
  /**
   * Get the Anthropic client
   */
  public getAnthropic(): AnthropicClient {
    if (!this.anthropicClient) {
      if (!this.config.anthropic?.apiKey) {
        throw new Error('Anthropic API key is not configured');
      }
      
      this.anthropicClient = new AnthropicClient(this.config.anthropic.apiKey);
    }
    
    return this.anthropicClient;
  }
  
  /**
   * Get the DeepSeek client
   */
  public getDeepSeek(): DeepSeekClient {
    if (!this.deepseekClient) {
      if (!this.config.deepseek?.apiKey) {
        throw new Error('DeepSeek API key is not configured');
      }
      
      this.deepseekClient = new DeepSeekClient(this.config.deepseek.apiKey);
    }
    
    return this.deepseekClient;
  }
  
  /**
   * Get the Perplexity client
   */
  public getPerplexity(): PerplexityClient {
    if (!this.perplexityClient) {
      if (!this.config.perplexity?.apiKey) {
        throw new Error('Perplexity API key is not configured');
      }
      
      this.perplexityClient = new PerplexityClient(this.config.perplexity.apiKey);
    }
    
    return this.perplexityClient;
  }
}
