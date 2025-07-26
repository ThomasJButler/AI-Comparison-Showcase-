import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModelSelector } from '@/components/model-selector'
import { Brain, Sparkles, Code } from 'lucide-react'

describe('ModelSelector', () => {
  const mockModels = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Advanced language model',
      icon: Brain
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      description: 'Anthropic model',
      icon: Sparkles
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      description: 'Code generation model',
      icon: Code
    }
  ]

  const defaultProps = {
    selectedModel: 'gpt-4',
    onSelectModel: jest.fn(),
    models: mockModels
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all available models', () => {
    render(<ModelSelector {...defaultProps} />)
    
    mockModels.forEach(model => {
      expect(screen.getByText(model.name)).toBeInTheDocument()
      expect(screen.getByText(model.description)).toBeInTheDocument()
    })
  })

  it('highlights the selected model', () => {
    render(<ModelSelector {...defaultProps} />)
    
    const selectedModelCard = screen.getByText('GPT-4').closest('div[role="button"]')
    expect(selectedModelCard).toHaveClass('border-matrix-primary')
    
    const unselectedModelCard = screen.getByText('Claude 3').closest('div[role="button"]')
    expect(unselectedModelCard).not.toHaveClass('border-matrix-primary')
  })

  it('calls onSelectModel when a model is clicked', async () => {
    const user = userEvent.setup()
    render(<ModelSelector {...defaultProps} />)
    
    const claudeModel = screen.getByText('Claude 3').closest('div[role="button"]')!
    await user.click(claudeModel)
    
    expect(defaultProps.onSelectModel).toHaveBeenCalledWith('claude-3')
  })

  it('renders model icons correctly', () => {
    render(<ModelSelector {...defaultProps} />)
    
    // Check that SVG icons are rendered
    const icons = document.querySelectorAll('svg')
    expect(icons).toHaveLength(mockModels.length)
  })

  it('applies hover effects', async () => {
    const user = userEvent.setup()
    render(<ModelSelector {...defaultProps} />)
    
    const modelCard = screen.getByText('Claude 3').closest('div[role="button"]')!
    
    await user.hover(modelCard)
    
    // Card should have hover styling
    expect(modelCard).toHaveClass('hover:border-matrix-primary/50')
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ModelSelector {...defaultProps} />)
    
    const firstModel = screen.getByText('GPT-4').closest('div[role="button"]')!
    firstModel.focus()
    
    // Press Enter to select
    await user.keyboard('{Enter}')
    expect(defaultProps.onSelectModel).toHaveBeenCalledWith('gpt-4')
    
    // Press Space to select
    await user.keyboard(' ')
    expect(defaultProps.onSelectModel).toHaveBeenCalledTimes(2)
  })

  it('displays loading state when no models are available', () => {
    render(<ModelSelector {...defaultProps} models={[]} />)
    
    expect(screen.getByText('No models available')).toBeInTheDocument()
  })

  it('applies correct accessibility attributes', () => {
    render(<ModelSelector {...defaultProps} />)
    
    const modelCards = screen.getAllByRole('button')
    
    modelCards.forEach((card, index) => {
      expect(card).toHaveAttribute('tabIndex', '0')
      expect(card).toHaveAttribute('aria-label', expect.stringContaining(mockModels[index].name))
    })
  })

  it('shows selection indicator on selected model', () => {
    render(<ModelSelector {...defaultProps} />)
    
    const selectedModel = screen.getByText('GPT-4').closest('div[role="button"]')
    const checkIcon = selectedModel?.querySelector('[data-testid="check-icon"]')
    
    expect(checkIcon).toBeInTheDocument()
  })

  it('maintains grid layout on different screen sizes', () => {
    const { container } = render(<ModelSelector {...defaultProps} />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
  })
})