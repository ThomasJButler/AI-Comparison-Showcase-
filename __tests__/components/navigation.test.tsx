import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '@/components/navigation'

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Navigation', () => {
  const navigationLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/models', label: 'Models' },
    { href: '/playground', label: 'Playground' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/docs', label: 'Documentation' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all navigation links', () => {
    render(<Navigation />)
    
    navigationLinks.forEach(link => {
      const navLink = screen.getByText(link.label)
      expect(navLink).toBeInTheDocument()
      expect(navLink.closest('a')).toHaveAttribute('href', link.href)
    })
  })

  it('renders the brand name and badge', () => {
    render(<Navigation />)
    
    expect(screen.getByText('AI Comparison')).toBeInTheDocument()
    expect(screen.getByText('Showcase')).toBeInTheDocument()
  })

  it('applies correct styling to navigation', () => {
    render(<Navigation />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed', 'w-full', 'z-50')
  })

  it('renders home link with correct attributes', () => {
    render(<Navigation />)
    
    const homeLink = screen.getByLabelText('AI Comparison Home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('includes icon for each navigation item', () => {
    render(<Navigation />)
    
    // Check that icons are rendered (they will be svg elements)
    const navItems = screen.getAllByRole('link')
    const mainNavItems = navItems.slice(1) // Skip the home link
    
    mainNavItems.forEach((item) => {
      const svg = item.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  it('applies hover styles to links', async () => {
    const user = userEvent.setup()
    render(<Navigation />)
    
    const dashboardLink = screen.getByText('Dashboard')
    
    await user.hover(dashboardLink)
    
    // The link should have hover classes
    expect(dashboardLink.closest('a')).toHaveClass('hover:text-matrix-primary')
  })

  it('maintains semantic HTML structure', () => {
    render(<Navigation />)
    
    // Should have nav element
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    // Should have proper ARIA label
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('renders responsive layout classes', () => {
    render(<Navigation />)
    
    // Check for responsive classes
    const linkContainer = screen.getByText('Dashboard').closest('div')
    expect(linkContainer?.parentElement).toHaveClass('hidden', 'sm:flex')
  })

  it('includes accessibility labels for icons', () => {
    render(<Navigation />)
    
    // Icons should be marked as decorative
    const icons = document.querySelectorAll('svg[aria-hidden="true"]')
    expect(icons.length).toBeGreaterThan(0)
  })
})