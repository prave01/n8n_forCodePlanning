# AI-Powered Code Planning and Execution Platform

#### Live Link
https://tried-n8n.vercel.app

#### Demo Video
https://drive.google.com/file/d/18u3-_oHqUEsq9Fh8xfqnKJutdk0G7Cxu/view?usp=sharing

### Project Analysis

- **ZIP File Import**: Upload entire projects as compressed archives for comprehensive analysis
- **File Tree Visualization**: Interactive file browser with syntax highlighting and code preview
- **Context-Aware Processing**: Intelligent extraction of relevant code context for AI processing

### AI-Powered Planning

- **Intelligent Plan Generation**: Uses Google's Gemini AI to analyze code and generate execution strategies
- **Contextual Understanding**: Processes multiple files simultaneously to understand project structure and dependencies
- **Dynamic Plan Creation**: Generates multiple execution plans based on user requirements and code complexity

### Visual Workflow Management

- **Interactive Node System**: Drag-and-drop interface for connecting execution plans
- **Real-time Execution**: Live code generation and modification with immediate feedback
- **Execution History**: Track all code changes with timestamps and status indicators
- **Error Handling**: Comprehensive error reporting and recovery mechanisms

### Code Management

- **Syntax Highlighting**: Advanced code display with language-specific formatting
- **Diff Visualization**: Side-by-side comparison of original and modified code
- **Live Updates**: Real-time code modification and file system updates
- **Export Capabilities**: Download modified code as updated ZIP files

## Technology Stack

### Frontend Framework

- **Next.js 15.5.4**: React-based full-stack framework with App Router for optimal performance and SEO
- **React 19.1.0**: Latest React version with concurrent features and improved rendering
- **TypeScript 5**: Strong typing system for enhanced code reliability and developer experience

### UI and Styling

- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Accessible component primitives for professional UI components
- **Lucide React**: Comprehensive icon library for consistent visual design
- **Motion (Framer Motion)**: Advanced animations and transitions for smooth user experience

### State Management

- **Zustand 5.0.8**: Lightweight state management solution for complex application state
- **React Flow (@xyflow/react)**: Specialized library for building interactive node-based interfaces

### AI Integration

- **OpenAI SDK 6.3.0**: Official client for Google Gemini AI integration
- **Zod 3**: Runtime type validation and schema definition for AI response handling

### Code Processing

- **JSZip 3.10.1**: Client-side ZIP file processing and manipulation
- **React Syntax Highlighter**: Advanced code syntax highlighting with multiple language support
- **React Diff Viewer**: Professional diff visualization for code comparison

### Development Tools

- **Biome 2.2.0**: Fast linter and formatter for code quality assurance
- **Prettier 3.6.2**: Code formatting with Tailwind CSS and import organization plugins
- **Turbopack**: Next-generation bundler for faster development builds

### Additional Libraries

- **Sonner**: Modern toast notification system for user feedback
- **React Spinners**: Loading indicators and progress visualization
- **React Resizable Panels**: Flexible layout management with resizable components
- **Next Themes**: Dark/light mode theming with system preference detection

## Architecture

### Component Structure

The application follows atomic design principles with clear separation of concerns:

- **Atoms**: Basic UI components (PlanCard, PlanInput)
- **Molecules**: Composite components (InputGroup, FileTree)
- **Templates**: Layout components (CodePanel, Plan)
- **Pages**: Complete page implementations (PlannerFlow)

### State Management

Centralized state management using Zustand stores:

- **File Store**: Manages uploaded project data and file system state
- **Plan Store**: Handles AI-generated execution plans
- **Context Store**: Manages code context for AI processing
- **Run State Store**: Tracks execution status and node connections

### AI Processing Pipeline

1. **Context Extraction**: Analyzes uploaded codebase to identify relevant files
2. **Plan Generation**: Uses Gemini AI to create execution strategies
3. **Code Execution**: Processes individual plans with targeted AI prompts
4. **Result Integration**: Merges generated code back into the project structure

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/prave01/Traycer_built ./traycer
cd traycer
```

2. Install dependencies:

```bash
yarn install
```

Add your Google Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Upload Project**: Import your project as a ZIP file through the drag-and-drop interface
2. **Add Context**: Select relevant files using the @ symbol for AI context
3. **Generate Plans**: Describe your requirements to generate execution plans
4. **Connect Nodes**: Link plans together to create complex workflows
5. **Execute Plans**: Run individual or connected plans to modify your code
6. **Review Changes**: Examine generated code and apply changes to your project

## Development

### Code Quality

The project uses Biome for linting and formatting:

```bash
yarn lint          # Check code quality
yarn format        # Format code
```

### Building for Production

```bash
yarn build         # Build optimized production bundle
yarn start         # Start production server
```

## API Integration

The application integrates with Google's Gemini AI through the OpenAI-compatible API:

- **Model**: gemini-2.5-flash for fast response times
- **Response Format**: Structured JSON using Zod schemas
- **Error Handling**: Comprehensive error management with user feedback
