/**
 * Anthropic API Client
 * 
 * Client for interacting with Anthropic's Claude models.
 * Handles authentication, request formation, and response parsing.
 */

import { ApiClient } from '../apiClient';
import * as AnthropicTypes from '../types/anthropic';

export class AnthropicClient extends ApiClient {
  // Claude API versions
  private apiVersion = '2023-06-01';
  private anthropicVersion = 'claude-3';
  
  constructor(apiKey: string) {
    super('https://api.anthropic.com/v1', {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    });
  }
  
  /**
   * List available models
   */
  async listModels(): Promise<AnthropicTypes.ModelObject[]> {
    // Anthropic doesn't have a list models endpoint, so we return hardcoded models
    return [
      {
        name: 'claude-3-opus-20240229',
        description: 'Anthropic\'s most powerful model for highly complex tasks',
        context_window: 200000,
        max_tokens: 4096
      },
      {
        name: 'claude-3-sonnet-20240229',
        description: 'Balanced model for most tasks with excellent performance',
        context_window: 200000,
        max_tokens: 4096
      },
      {
        name: 'claude-3-haiku-20240307',
        description: 'Fastest and most compact model for simple tasks',
        context_window: 200000,
        max_tokens: 4096
      },
      {
        name: 'claude-2.1',
        description: 'Previous generation model with good performance',
        context_window: 100000,
        max_tokens: 4096
      }
    ];
  }
  
  /**
   * Create a message
   */
  async createMessage(
    request: AnthropicTypes.MessageRequest
  ): Promise<AnthropicTypes.MessageResponse> {
    return this.post<AnthropicTypes.MessageResponse>('messages', request);
  }
  
  /**
   * Utility method for simple text completion
   */
  async generateText(
    prompt: string,
    systemPrompt: string = "",
    model: string = "claude-3-sonnet-20240229",
    options: Partial<AnthropicTypes.MessageRequest> = {}
  ): Promise<string> {
    const response = await this.createMessage({
      model,
      messages: [{ role: 'user', content: prompt }],
      system: systemPrompt,
      max_tokens: 1024,
      temperature: 0.7,
      ...options
    });
    
    // Extract text content from all blocks
    const textContent = response.content
      .filter(block => block.type === 'text' && block.text)
      .map(block => block.text)
      .join('');
    
    return textContent;
  }
  
  /**
   * Test connection to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.createMessage({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: 'Hello, are you working?' }],
        max_tokens: 10
      });
      
      return response.id !== undefined;
    } catch (error) {
      console.error('Anthropic API connection test failed:', error);
      return false;
    }
  }
}
