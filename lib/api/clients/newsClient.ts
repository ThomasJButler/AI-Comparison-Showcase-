/**
 * News API Client
 * 
 * Client for interacting with the News API.
 * Requires an API key from https://newsapi.org/
 */

import { ApiClient } from '../apiClient';
import * as NewsTypes from '../types/news';

export class NewsClient extends ApiClient {
  constructor(apiKey: string) {
    super('https://newsapi.org/v2', {
      'X-Api-Key': apiKey
    });
  }
  
  /**
   * Get top headlines
   * https://newsapi.org/docs/endpoints/top-headlines
   */
  async getTopHeadlines(params: NewsTypes.TopHeadlinesParams = {}): Promise<NewsTypes.TopHeadlinesResponse> {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add optional parameters if provided
    if (params.country) {
      queryParams.append('country', params.country);
    }
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.sources) {
      queryParams.append('sources', params.sources);
    }
    if (params.q) {
      queryParams.append('q', params.q);
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    return this.get<NewsTypes.TopHeadlinesResponse>(`top-headlines?${queryParams.toString()}`);
  }
  
  /**
   * Get everything
   * https://newsapi.org/docs/endpoints/everything
   */
  async getEverything(params: NewsTypes.EverythingParams = {}): Promise<NewsTypes.EverythingResponse> {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add optional parameters if provided
    if (params.q) {
      queryParams.append('q', params.q);
    }
    if (params.searchIn) {
      queryParams.append('searchIn', params.searchIn);
    }
    if (params.sources) {
      queryParams.append('sources', params.sources);
    }
    if (params.domains) {
      queryParams.append('domains', params.domains);
    }
    if (params.excludeDomains) {
      queryParams.append('excludeDomains', params.excludeDomains);
    }
    if (params.from) {
      queryParams.append('from', params.from);
    }
    if (params.to) {
      queryParams.append('to', params.to);
    }
    if (params.language) {
      queryParams.append('language', params.language);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    return this.get<NewsTypes.EverythingResponse>(`everything?${queryParams.toString()}`);
  }
  
  /**
   * Get sources
   * https://newsapi.org/docs/endpoints/sources
   */
  async getSources(params: NewsTypes.SourcesParams = {}): Promise<NewsTypes.SourcesResponse> {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add optional parameters if provided
    if (params.category) {
      queryParams.append('category', params.category);
    }
    if (params.language) {
      queryParams.append('language', params.language);
    }
    if (params.country) {
      queryParams.append('country', params.country);
    }
    
    // Set defaults for testing if no parameters provided
    if (queryParams.toString() === '') {
      queryParams.append('language', 'en');
    }
    
    return this.get<NewsTypes.SourcesResponse>(`sources?${queryParams.toString()}`);
  }
  
  /**
   * Test connection
   * A simplified method just to verify the API key works
   */
  async testConnection(): Promise<boolean> {
    try {
      // Use a minimal call to verify the API key
      const queryParams = new URLSearchParams();
      queryParams.append('language', 'en');
      queryParams.append('pageSize', '1');
      
      // First try sources endpoint as it's lighter
      try {
        await this.get<NewsTypes.SourcesResponse>(`sources?${queryParams.toString()}`);
        return true;
      } catch (error) {
        // If sources fails, try headlines as a fallback
        const headlineParams = new URLSearchParams();
        headlineParams.append('country', 'us');
        headlineParams.append('pageSize', '1');
        await this.get<NewsTypes.TopHeadlinesResponse>(`top-headlines?${headlineParams.toString()}`);
        return true;
      }
    } catch (error) {
      console.error('News API connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Search news by keyword
   * Convenience method that searches everything
   */
  async searchNews(
    query: string,
    options: {
      language?: string;
      sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
      pageSize?: number;
      page?: number;
    } = {}
  ): Promise<NewsTypes.Article[]> {
    const response = await this.getEverything({
      q: query,
      language: options.language,
      sortBy: options.sortBy || 'publishedAt',
      pageSize: options.pageSize || 10,
      page: options.page || 1
    });
    
    return response.articles;
  }
  
  /**
   * Get headlines by category
   * Convenience method that gets top headlines by category
   */
  async getHeadlinesByCategory(
    category: 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology',
    country: string = 'us',
    pageSize: number = 10
  ): Promise<NewsTypes.Article[]> {
    const response = await this.getTopHeadlines({
      category,
      country,
      pageSize
    });
    
    return response.articles;
  }
  
  /**
   * Get latest news
   * Convenience method that gets the latest news
   */
  async getLatestNews(
    country: string = 'us',
    pageSize: number = 10
  ): Promise<NewsTypes.Article[]> {
    const response = await this.getTopHeadlines({
      country,
      pageSize
    });
    
    return response.articles;
  }
}
