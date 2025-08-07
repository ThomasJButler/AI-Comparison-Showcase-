import { generatePlaygroundResponse, type PlaygroundRequest } from '@/lib/playground/api'
import { ApiService } from '@/lib/api'

// Mock the API service
jest.mock('@/lib/api', () => ({
  ApiService: {
    getInstance: jest.fn()
  }
}))

describe('Playground API', () => {
  let mockApiService: any
  let mockOpenAIClient: any
  let mockAnthropicClient: any
  let mockDeepSeekClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock API clients
    mockOpenAIClient = {
      generateCompletion: jest.fn()
    }
    
    mockAnthropicClient = {
      generateCompletion: jest.fn()
    }
    
    mockDeepSeekClient = {
      generateText: jest.fn()
    }
    
    mockApiService = {
      getOpenAI: jest.fn().mockReturnValue(mockOpenAIClient),
      getAnthropic: jest.fn().mockReturnValue(mockAnthropicClient),
      getDeepSeek: jest.fn().mockReturnValue(mockDeepSeekClient),
      getPerplexity: jest.fn()
    }
    
    ;(ApiService.getInstance as jest.Mock).mockReturnValue(mockApiService)
  })

  describe('generatePlaygroundResponse', () => {
    it('generates response from OpenAI provider', async () => {
      const request: PlaygroundRequest = {
        modelId: 'gpt-4',
        provider: 'OpenAI',
        input: 'Test prompt',
        inputFormat: 'text'
      }

      const mockResponse = {
        content: 'Test response from GPT-4',
        usage: { total_tokens: 50 }
      }

      mockOpenAIClient.generateCompletion.mockResolvedValue(mockResponse)

      const result = await generatePlaygroundResponse(request)

      expect(mockOpenAIClient.generateCompletion).toHaveBeenCalledWith(
        'Test prompt',
        'gpt-4',
        1024,  // default maxTokens
        0.7    // default temperature
      )
      
      expect(result).toEqual({
        content: 'Test response from GPT-4',
        metadata: {
          model: 'gpt-4',
          tokens_used: 50,
          processing_time: expect.any(String),
          confidence: expect.any(Number)
        }
      })
    })

    it('generates response from Anthropic provider', async () => {
      const request: PlaygroundRequest = {
        modelId: 'claude-3-opus',
        provider: 'Anthropic',
        input: 'Test prompt',
        inputFormat: 'text',
        maxTokens: 1000,
        temperature: 0.7
      }

      const mockResponse = {
        content: 'Test response from Claude',
        usage: { total_tokens: 75 }
      }

      mockAnthropicClient.generateCompletion.mockResolvedValue(mockResponse)

      const result = await generatePlaygroundResponse(request)

      expect(mockAnthropicClient.generateCompletion).toHaveBeenCalledWith(
        'Test prompt',
        'claude-3-opus',
        1000,
        0.7
      )
      
      expect(result.content).toBe('Test response from Claude')
      expect(result.metadata?.tokens_used).toBe(75)
    })

    it('handles JSON input format correctly', async () => {
      const jsonInput = {
        input: 'Explain quantum computing',
        max_tokens: 200,
        temperature: 0.5
      }

      const request: PlaygroundRequest = {
        modelId: 'gpt-4',
        provider: 'OpenAI',
        input: JSON.stringify(jsonInput),
        inputFormat: 'json'
      }

      mockOpenAIClient.generateCompletion.mockResolvedValue({
        content: 'Quantum computing explanation...',
        usage: { total_tokens: 150 }
      })

      const result = await generatePlaygroundResponse(request)

      expect(mockOpenAIClient.generateCompletion).toHaveBeenCalledWith(
        'Explain quantum computing',
        'gpt-4',
        1024,  // default maxTokens - JSON parsing happens in playground page, not API
        0.7    // default temperature - JSON parsing happens in playground page, not API
      )
      
      expect(result.content).toBe('Quantum computing explanation...')
    })

    it('returns demo response when API is not configured', async () => {
      mockApiService.getOpenAI = undefined

      const request: PlaygroundRequest = {
        modelId: 'gpt-4',
        provider: 'OpenAI',
        input: 'Test prompt',
        inputFormat: 'text'
      }

      const result = await generatePlaygroundResponse(request)

      expect(result.content).toContain('This is a demo response')
      expect(result.metadata?.model).toBe('gpt-4')
      expect(result.metadata?.tokens_used).toBeGreaterThan(0)
    })

    it('handles errors gracefully', async () => {
      const request: PlaygroundRequest = {
        modelId: 'gpt-4',
        provider: 'OpenAI',
        input: 'Test prompt',
        inputFormat: 'text'
      }

      mockOpenAIClient.generateCompletion.mockRejectedValue(new Error('API Error'))

      const result = await generatePlaygroundResponse(request)

      expect(result.error).toBe('Failed to generate response: OpenAI API error: API Error')
      expect(result.content).toBe('')
    })

    it('handles code input format', async () => {
      const codeInput = `
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)
      `

      const request: PlaygroundRequest = {
        modelId: 'deepseek-coder',
        provider: 'DeepSeek',
        input: codeInput,
        inputFormat: 'code'
      }

      // Set DeepSeek as undefined to test demo response
      mockApiService.getDeepSeek = undefined

      // Should return demo response for unconfigured provider
      const result = await generatePlaygroundResponse(request)

      expect(result.content).toBeDefined()
      expect(result.content).toContain('demo response')
      expect(result.metadata?.model).toBe('deepseek-coder')
    })

    it('calculates confidence score based on response length', async () => {
      const request: PlaygroundRequest = {
        modelId: 'gpt-4',
        provider: 'OpenAI',
        input: 'Short',
        inputFormat: 'text'
      }

      mockOpenAIClient.generateCompletion.mockResolvedValue({
        content: 'A'.repeat(1000), // Long response
        usage: { total_tokens: 200 }
      })

      const result = await generatePlaygroundResponse(request)

      expect(result.metadata?.confidence).toBeGreaterThan(0.8)
    })

    it('formats processing time correctly', async () => {
      const request: PlaygroundRequest = {
        modelId: 'gpt-4',
        provider: 'OpenAI',
        input: 'Test',
        inputFormat: 'text'
      }

      mockOpenAIClient.generateCompletion.mockResolvedValue({
        content: 'Response',
        usage: { total_tokens: 10 }
      })

      const result = await generatePlaygroundResponse(request)

      expect(result.metadata?.processing_time).toMatch(/^\d+\.\d+s$/)
    })
  })
})