/**
 * OpenAI API Client
 * 
 * Client for interacting with the OpenAI API.
 * Handles authentication, request formation, and response parsing.
 */

import { ApiClient } from '../apiClient';
import * as OpenAITypes from '../types/openai';

export class OpenAIClient extends ApiClient {
  constructor(apiKey: string) {
    super('https://api.openai.com/v1', {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v1'
    });
  }

  /**
   * List available models
   */
  async listModels(): Promise<OpenAITypes.ListModelsResponse> {
    return this.get<OpenAITypes.ListModelsResponse>('models');
  }

  /**
   * Get a specific model
   */
  async getModel(modelId: string): Promise<OpenAITypes.Model> {
    return this.get<OpenAITypes.Model>(`models/${modelId}`);
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(
    request: OpenAITypes.ChatCompletionRequest
  ): Promise<OpenAITypes.ChatCompletionResponse> {
    return this.post<OpenAITypes.ChatCompletionResponse>('chat/completions', request);
  }

  /**
   * Create embeddings for input text
   */
  async createEmbeddings(
    request: OpenAITypes.EmbeddingRequest
  ): Promise<OpenAITypes.EmbeddingResponse> {
    return this.post<OpenAITypes.EmbeddingResponse>('embeddings', request);
  }

  /**
   * Check content for policy violations
   */
  async createModeration(
    request: OpenAITypes.ModerationRequest
  ): Promise<OpenAITypes.ModerationResponse> {
    return this.post<OpenAITypes.ModerationResponse>('moderations', request);
  }

  /**
   * Utility method for simple chat completions
   */
  async generateText(
    prompt: string,
    systemPrompt: string = "You are a helpful assistant.",
    model: string = "gpt-3.5-turbo",
    options: Partial<OpenAITypes.ChatCompletionRequest> = {}
  ): Promise<string> {
    const messages: OpenAITypes.Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const response = await this.createChatCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Utility method to generate embeddings for a single string
   */
  async generateEmbedding(
    text: string,
    model: string = "text-embedding-ada-002"
  ): Promise<number[]> {
    const response = await this.createEmbeddings({
      model,
      input: text
    });

    return response.data[0].embedding;
  }

  /**
   * Generate completion - wrapper method for compatibility
   */
  async generateCompletion(
    prompt: string,
    model: string = "gpt-3.5-turbo",
    maxTokens?: number,
    temperature?: number
  ): Promise<{ content: string; usage?: { total_tokens: number } }> {
    const response = await this.createChatCompletion({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 1000,
      temperature: temperature !== undefined ? temperature : 0.7
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage
    };
  }
}
