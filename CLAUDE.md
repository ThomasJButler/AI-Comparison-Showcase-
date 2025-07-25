# AI Comparison Showcase - Project Context

## Project Overview
This is a portfolio piece showcasing an interactive AI comparison tool. It's based on the AiTomatic codebase but will be a separate website focused specifically on AI comparisons.

**Important**: Remove all AiTomatic.co.uk branding and repository information as the original AiTomatic is continuing as a neurodiversity-focused application.

## Project Goals
1. Create a beautiful, interactive AI Comparison Showcase
2. Build a working MVP that can be added to portfolio
3. Implement proper testing (TDD approach)
4. Learn and document the development process
5. Ensure code quality and best practices

## Technical Stack
- Frontend: [To be determined based on existing codebase]
- Backend: [To be determined based on existing codebase]
- Testing: TDD approach with meaningful tests
- Documentation: Learning guides and architectural explanations

## Development Principles
1. **Test-Driven Development**: Write tests that expose real issues, then fix code
2. **Frequent Commits**: Regular commits with meaningful messages
3. **Clear Communication**: UK English, practical comments only
4. **Educational Approach**: Create learning files to explain concepts
5. **Quality First**: Ensure each feature is tested before progression

## Agent Coordination
The project uses multiple specialized agents working in harmony:
- Each agent has a specific domain and responsibility
- Agents communicate through defined interfaces
- Quality gates ensure standards are met
- Parallel execution where possible

## Key Commands
- Linting: [To be determined from package.json]
- Type checking: [To be determined from package.json]
- Testing: [To be determined from package.json]
- Development server: [To be determined from package.json]

## Current Status
- Project is ~80% complete
- Needs finishing touches and polish
- Requires removal of original AiTomatic branding
- Focus on creating showcase-ready interactive features

## Learning Resources
Educational documentation will be created in:
- `/docs/learning/` - Concept explanations
- `/docs/architecture/` - System design decisions
- `/docs/patterns/` - Code patterns and best practices

## Agent System

### Available Agents
The project uses 10 specialized agents + 1 master coordinator:

1. **codebase-analyzer** - Analyzes existing code structure
2. **branding-remover** - Removes AiTomatic branding
3. **test-architect** - Creates TDD test scenarios
4. **feature-completer** - Completes unfinished features
5. **ui-enhancer** - Polishes UI for portfolio
6. **interaction-designer** - Designs smooth interactions
7. **performance-optimizer** - Optimizes performance
8. **documentation-writer** - Creates documentation
9. **deployment-preparer** - Prepares for deployment
10. **quality-guardian** - Final quality review
11. **master-coordinator** - Orchestrates all agents

### Running Agents

#### Option 1: Using Slash Commands (Easiest!)
Simply type these commands in Claude:

- `/run-all` - Runs complete orchestration (recommended)
- `/run-analysis` - Analyzes the codebase
- `/remove-branding` - Removes AiTomatic branding
- `/run-tests` - Creates TDD tests
- `/complete-features` - Completes features
- `/enhance-ui` - Enhances UI
- `/design-interactions` - Designs interactions
- `/optimize-performance` - Optimizes performance
- `/write-docs` - Writes documentation
- `/prepare-deployment` - Prepares deployment
- `/quality-review` - Reviews quality

#### Option 2: Direct Agent Calls
```
Task(
  description="Brief description",
  prompt="Detailed instructions",
  subagent_type="agent-name"
)
```

Example:
```
Task(
  description="Analyze project",
  prompt="Analyze the AI Comparison Showcase codebase",
  subagent_type="codebase-analyzer"
)
```

### Execution Phases
The master coordinator runs agents in this order:

1. **Analysis** - `/run-analysis`
2. **Cleanup** - `/remove-branding`
3. **Development** (parallel):
   - `/run-tests`
   - `/complete-features`
   - `/enhance-ui`
   - `/design-interactions`
4. **Optimization** - `/optimize-performance`
5. **Documentation** - `/write-docs`
6. **Deployment** - `/prepare-deployment`
7. **Quality** - `/quality-review`

### Quick Start
To complete the entire project, simply run:
```
/run-all
```

This will orchestrate all agents automatically!