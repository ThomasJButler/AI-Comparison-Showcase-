/**
 * DeepSeek API Client
 * 
 * Client for interacting with DeepSeek's AI models.
 * Handles authentication, request formation, and response parsing.
 */

import { ApiClient } from '../apiClient';
import * as DeepSeekTypes from '../types/deepseek';

export class DeepSeekClient extends ApiClient {
  constructor(apiKey: string) {
    super('https://api.deepseek.com/v1', {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });
  }
  
  /**
   * List available models
   */
  async listModels(): Promise<DeepSeekTypes.ModelObject[]> {
    try {
      const response = await this.get<DeepSeekTypes.ListModelsResponse>('models');
      return response.data;
    } catch (error) {
      // DeepSeek might not have a models endpoint similar to OpenAI's
      // Provide hardcoded models as fallback
      console.warn('Could not fetch DeepSeek models, returning hardcoded list');
      return [
        {
          id: 'deepseek-chat',
          object: 'model',
          created: Date.now(),
          owned_by: 'deepseek'
        },
        {
          id: 'deepseek-coder',
          object: 'model',
          created: Date.now(),
          owned_by: 'deepseek'
        },
        {
          id: 'deepseek-lite',
          object: 'model',
          created: Date.now(),
          owned_by: 'deepseek'
        }
      ];
    }
  }
  
  /**
   * Create a chat completion
   */
  async createChatCompletion(
    request: DeepSeekTypes.ChatCompletionRequest
  ): Promise<DeepSeekTypes.ChatCompletionResponse> {
    return this.post<DeepSeekTypes.ChatCompletionResponse>('chat/completions', request);
  }
  
  /**
   * Utility method for simple text completion
   */
  async generateText(
    prompt: string,
    systemPrompt: string = "",
    model: string = "deepseek-chat",
    options: Partial<DeepSeekTypes.ChatCompletionRequest> = {}
  ): Promise<string> {
    // Build messages array
    const messages: DeepSeekTypes.Message[] = [];
    
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
   * Test connection to the API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try a minimal API call to validate the key
      const response = await this.createChatCompletion({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hello!' }],
        max_tokens: 10
      });
      
      return response.id !== undefined;
    } catch (error) {
      console.error('DeepSeek API connection test failed:', error);
      return false;
    }
  }
}
