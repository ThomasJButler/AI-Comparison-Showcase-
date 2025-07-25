/**
 * Perplexity API Client
 * 
 * Client for interacting with Perplexity's AI models.
 * Handles authentication, request formation, and response parsing.
 */

import { ApiClient } from '../apiClient';
import * as PerplexityTypes from '../types/perplexity';

export class PerplexityClient extends ApiClient {
  constructor(apiKey: string) {
    super('https://api.perplexity.ai', {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });
  }
  
  /**
   * List available models
   */
  async listModels(): Promise<PerplexityTypes.ModelObject[]> {
    // Perplexity doesn't have a list models endpoint, so we return hardcoded models
    return [
      {
        id: 'sonar-small-online',
        name: 'Sonar Small (Online)',
        description: 'Fast model with internet search capabilities',
        context_length: 12000,
        capabilities: ['web_search', 'coding', 'summarization']
      },
      {
        id: 'sonar-medium-online',
        name: 'Sonar Medium (Online)',
        description: 'Balanced model with internet search capabilities',
        context_length: 12000,
        capabilities: ['web_search', 'coding', 'summarization', 'analysis']
      },
      {
        id: 'sonar-large-online',
        name: 'Sonar Large (Online)',
        description: 'Most powerful model with internet search capabilities',
        context_length: 12000,
        capabilities: ['web_search', 'coding', 'summarization', 'analysis', 'creative_writing']
      },
      {
        id: 'mistral-7b-instruct',
        name: 'Mistral 7B Instruct',
        description: 'Lightweight model for basic tasks',
        context_length: 8000,
        capabilities: ['coding', 'conversation', 'instruction_following']
      },
      {
        id: 'llama-3-8b-instruct',
        name: 'Llama-3 8B Instruct',
        description: 'Small, efficient model for various tasks',
        context_length: 8000,
        capabilities: ['coding', 'conversation', 'instruction_following']
      },
      {
        id: 'llama-3-70b-instruct',
        name: 'Llama-3 70B Instruct',
        description: 'Powerful general purpose model',
        context_length: 8000,
        capabilities: ['coding', 'conversation', 'instruction_following', 'reasoning']
      }
    ];
  }
  
  /**
   * Create a chat completion
   */
  async createChatCompletion(
    request: PerplexityTypes.ChatCompletionRequest
  ): Promise<PerplexityTypes.ChatCompletionResponse> {
    return this.post<PerplexityTypes.ChatCompletionResponse>('/chat/completions', request);
  }
  
  /**
   * Utility method for simple text completion
   */
  async generateText(
    prompt: string,
    systemPrompt: string = "",
    model: string = "llama-3-70b-instruct",
    options: Partial<PerplexityTypes.ChatCompletionRequest> = {}
  ): Promise<string> {
    // Build messages array
    const messages: PerplexityTypes.Message[] = [];
    
    // Add system message if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // Add user message
    messages.push({
      role: 'user',
      content: prompt
    });
    
    // Create completion
    const response = await this.createChatCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      ...options
    });
    
    // Return the text content
    return response.choices[0]?.message.content || '';
  }
  
  /**
   * Generate text with online search capabilities
   * Specifically for Sonar models which have web search
   */
  async searchAndGenerateText(
    query: string,
    systemPrompt: string = "",
    model: string = "sonar-medium-online",
    options: Partial<PerplexityTypes.ChatCompletionRequest> = {}
  ): Promise<string> {
    // Validate model is a Sonar model
    if (!model.includes('sonar')) {
      console.warn('Search capability is only available with Sonar models');
      model = 'sonar-medium-online'; // Default to Sonar if wrong model type passed
    }
    
    return this.generateText(query, systemPrompt, model, options);
  }
  
  /**
   * Test connection to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try a minimal API call to validate the key
      const response = await this.createChatCompletion({
        model: 'mistral-7b-instruct', // Use a lightweight model for testing
        messages: [{ role: 'user', content: 'Hello!' }],
        max_tokens: 10
      });
      
      return response.id !== undefined;
    } catch (error) {
      console.error('Perplexity API connection test failed:', error);
      return false;
    }
  }
}
