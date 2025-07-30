# PromptOps - Full-Stack SaaS Application

## Overview

PromptOps is a modern SaaS web application designed for managing and testing AI prompts. Built as a monorepo with a React frontend and Express.js backend, it provides users with tools to create, save, edit, and test prompts using AI models like Gemini and GPT-4o.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Theme**: Dark mode with green/emerald accent colors as specified in requirements

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and session management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon Database serverless PostgreSQL
- **Schema**: Centralized in `/shared/schema.ts` with proper relations
- **Migration**: Drizzle Kit for schema management

## Key Components

### Authentication System
- Email/password authentication using Passport.js local strategy
- Secure password hashing with Node.js crypto (scrypt)
- Session-based authentication with PostgreSQL session store
- Protected routes on both frontend and backend

### AI Integration Service
- **Primary**: Google Gemini (gemini-2.5-flash) via @google/genai
- **Secondary**: DeepSeek V3 Pro via OpenAI-compatible API
- **Fallback**: OpenAI GPT-4o via official OpenAI SDK
- Enhanced prompt formatting for improved response quality
- Intelligent fallback system: tries preferred model first, then others on failure
- Response tracking with timing and success metrics

### Database Schema
- **Users**: Authentication, plan management, usage tracking, Stripe integration
- **Prompts**: User-owned prompts with title, content, description, and status
- **Prompt Runs**: Historical records of AI model executions with performance metrics

### Payment System
- Stripe integration for subscription management
- Three-tier plan structure:
  - Free: 5 prompts maximum
  - Pro: 100 prompts ($19/month)
  - Team: Unlimited prompts ($49/month)

### UI Components
- Custom component library built on Radix UI primitives
- Responsive design with mobile and desktop support
- Dark theme with emerald green accents
- Consistent design system with CSS custom properties

## Data Flow

### Authentication Flow
1. User submits credentials via React form
2. Frontend sends POST to `/api/login`
3. Backend validates via Passport.js local strategy
4. Session created and stored in PostgreSQL
5. User data cached in TanStack Query

### Prompt Testing Flow
1. User inputs prompt content in Quick Test component
2. Frontend calls `/api/test-prompt` with prompt content
3. Backend routes through AI service (Gemini → OpenAI fallback)
4. Response with AI output, model used, and timing returned
5. Prompt run record created in database for history

### Data Management
- TanStack Query handles server state caching and synchronization
- Optimistic updates for better user experience
- Automatic cache invalidation on mutations
- Error boundaries for graceful error handling

## External Dependencies

### Core Dependencies
- **@google/genai**: Google Gemini AI integration
- **openai**: OpenAI GPT integration and DeepSeek API compatibility
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **passport**: Authentication middleware
- **express-session**: Session management
- **stripe**: Payment processing

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Concurrent development with proper proxy setup
- Environment-specific configurations

### Production Build
- Vite builds optimized React bundle to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single deployment artifact with both frontend and backend
- Static file serving from Express for SPA routing

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`: Google AI API access
- `DEEPSEEK_API_KEY`: DeepSeek V3 Pro API access
- `OPENAI_API_KEY`: OpenAI API access (fallback)
- `STRIPE_SECRET_KEY`: Stripe payment processing

### Hosting Platform
- Designed for Replit deployment
- Monorepo structure with clear separation of concerns
- Health checks and monitoring endpoints
- Graceful error handling and logging

### Security Considerations
- Secure session management with httpOnly cookies
- Environment variable protection for API keys
- CORS configuration for production
- Input validation and sanitization
- Rate limiting considerations for AI API calls

### Scalability Features
- Database connection pooling with Neon
- Efficient query patterns with Drizzle ORM
- Client-side caching with TanStack Query
- Optimized bundle sizes with tree shaking