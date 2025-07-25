/**
 * Playground API
 * 
 * Handles the connection between the playground UI and the various API providers.
 * This service abstracts away the differences between the APIs and provides a 
 * consistent interface for the playground to use.
 */

import { ApiService, OpenAITypes } from '@/lib/api';

export interface PlaygroundRequest {
  modelId: string;
  provider: string;
  input: string;
  inputFormat: 'json' | 'text' | 'code';
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface PlaygroundResponse {
  content: string;
  metadata?: {
    tokens_used: number;
    processing_time: string;
    model: string;
    confidence: number;
  };
  error?: string;
}

export async function generatePlaygroundResponse(request: PlaygroundRequest): Promise<PlaygroundResponse> {
  const startTime = performance.now();
  
  try {
    // Get the correct API client based on the provider
    const apiService = ApiService.getInstance();
    let response = '';
    let tokensUsed = 0;
    
    // Determine the appropriate temperature (default to 0.7 if not specified)
    const temperature = request.temperature !== undefined ? request.temperature : 0.7;
    
    // Determine the appropriate max tokens (default to 1024 if not specified)
    const maxTokens = request.maxTokens !== undefined ? request.maxTokens : 1024;
    
    // Handle the input format
    let prompt = request.input;
    let systemPrompt = '';
    
    // Setup system prompts based on input format
    if (request.inputFormat === 'json') {
      try {
        const jsonInput = JSON.parse(prompt);
        if (jsonInput.system) {
          systemPrompt = jsonInput.system;
        }
        if (jsonInput.input) {
          prompt = jsonInput.input;
        }
        // If input contains other parameters, keep using the full JSON
      } catch (e) {
        // If not valid JSON, use as-is
      }
    } else if (request.inputFormat === 'code') {
      systemPrompt = "You are a code analyst. Analyze the following code and provide insights, improvements, and potential issues.";
    }
    
    // Handle different providers
    switch (request.provider) {
      case 'OpenAI':
        try {
          // OpenAI API call
          const messages: OpenAITypes.Message[] = [];
          
          if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
          }
          
          messages.push({ role: 'user', content: prompt });
          
          const completion = await apiService.getOpenAI().createChatCompletion({
            model: request.modelId,
            messages,
            temperature,
            max_tokens: maxTokens
          });
          
          response = completion.choices[0]?.message?.content || '';
          tokensUsed = completion.usage?.total_tokens || 0;
        } catch (error: any) {
          console.error('OpenAI API error:', error);
          throw new Error(`OpenAI API error: ${error.message || 'Unknown error'}`);
        }
        break;
        
      case 'Anthropic':
        try {
          // Anthropic API call
          response = await apiService.getAnthropic().generateText(
            prompt,
            systemPrompt,
            request.modelId,
            {
              temperature,
              max_tokens: maxTokens
            }
          );
          
          // Anthropic doesn't directly provide token count in the simple wrapper
          // We can estimate tokens based on text length (rough estimate)
          tokensUsed = Math.ceil(response.length / 4) + Math.ceil(prompt.length / 4);
        } catch (error: any) {
          console.error('Anthropic API error:', error);
          throw new Error(`Anthropic API error: ${error.message || 'Unknown error'}`);
        }
        break;
        
      case 'DeepSeek':
        try {
          // DeepSeek API call
          response = await apiService.getDeepSeek().generateText(
            prompt,
            systemPrompt,
            request.modelId,
            {
              temperature,
              max_tokens: maxTokens
            }
          );
          
          // DeepSeek doesn't directly provide token count in the simple wrapper
          // We can estimate tokens based on text length (rough estimate)
          tokensUsed = Math.ceil(response.length / 4) + Math.ceil(prompt.length / 4);
        } catch (error: any) {
          console.error('DeepSeek API error:', error);
          throw new Error(`DeepSeek API error: ${error.message || 'Unknown error'}`);
        }
        break;
        
      case 'Perplexity':
        try {
          // Handle Perplexity's special case for Sonar models (online search)
          if (request.modelId.includes('sonar')) {
            response = await apiService.getPerplexity().searchAndGenerateText(
              prompt,
              systemPrompt,
              request.modelId,
              {
                temperature,
                max_tokens: maxTokens
              }
            );
          } else {
            // Standard Perplexity API call
            response = await apiService.getPerplexity().generateText(
              prompt,
              systemPrompt,
              request.modelId,
              {
                temperature,
                max_tokens: maxTokens
              }
            );
          }
          
          // Perplexity doesn't directly provide token count in the simple wrapper
          // We can estimate tokens based on text length (rough estimate)
          tokensUsed = Math.ceil(response.length / 4) + Math.ceil(prompt.length / 4);
        } catch (error: any) {
          console.error('Perplexity API error:', error);
          throw new Error(`Perplexity API error: ${error.message || 'Unknown error'}`);
        }
        break;
        
      case 'Demo':
        // Simulate API call for demo models
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (request.inputFormat === 'json') {
          response = "This is a simulated response from a demo model. In a real implementation, this would be generated by an actual AI model API. The response would be tailored to the input JSON parameters and would provide relevant information or analysis.";
        } else if (request.inputFormat === 'code') {
          response = "Code Analysis Results:\n\n1. Structure: The code appears well-structured with clear function definitions.\n2. Best practices: Following standard naming conventions and patterns.\n3. Potential improvements:\n   - Consider adding more error handling\n   - Add documentation for complex logic\n   - Optimize performance in the main loop\n\nOverall, the code is well-written but could benefit from these minor improvements.";
        } else {
          response = "This is a simulated response from a demo model. In a real implementation, this would be generated by an actual AI model based on your text input. For now, this is just placeholder text to demonstrate how the interface would work with real API connections.";
        }
        
        tokensUsed = prompt.length + response.length;
        break;
        
      default:
        throw new Error(`Unknown provider: ${request.provider}`);
    }
    
    // Calculate processing time
    const endTime = performance.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(3);
    
    // Return formatted response
    return {
      content: response,
      metadata: {
        tokens_used: tokensUsed,
        processing_time: `${processingTime}s`,
        model: request.modelId,
        confidence: 0.92 + (Math.random() * 0.08) // Simulate confidence between 0.92 and 1.0
      }
    };
  } catch (error: any) {
    console.error('Error generating playground response:', error);
    
    // Calculate processing time even for errors
    const endTime = performance.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(3);
    
    return {
      content: '',
      error: error.message || 'An unknown error occurred',
      metadata: {
        tokens_used: 0,
        processing_time: `${processingTime}s`,
        model: request.modelId,
        confidence: 0
      }
    };
  }
}
