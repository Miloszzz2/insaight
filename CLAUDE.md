# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InsAight is an AI-powered YouTube comment analysis application built with Next.js 15, TypeScript, and Supabase. The app helps content creators understand their audience feedback by categorizing comments by topic and sentiment using the Gemini 2.0 Flash API.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js rules

### Environment Setup
Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - Google Gemini API key for AI categorization
- `YOUTUBE_API_KEY` - YouTube Data API v3 key

## Architecture Overview

### Database Schema (Supabase)
The application uses a relational database with these main tables:
- `users` - User profiles with YouTube channel data
- `videos` - YouTube video metadata and stats
- `analysis` - Overall sentiment analysis results per video
- `comment_groups` - AI-generated categories with icons and descriptions
- `comments` - Individual comments with sentiment and category assignments

### Application Flow
1. **Authentication**: Google OAuth via Supabase Auth for YouTube access
2. **Dashboard**: Displays user's YouTube videos with analysis status
3. **Comment Fetching**: YouTube API v3 integration fetches comments in batches of 100
4. **AI Processing**: Gemini API categorizes comments and performs sentiment analysis
5. **Analysis View**: Displays categorized comments grouped by topic and sentiment

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components organized by feature
- `src/types/` - TypeScript type definitions for database and API
- `src/utils/` - Utility functions and Supabase client configurations

### API Routes
- `api/youtube/comments/[id]` - Fetches comments for a video ID
- `api/ai/categorize` - AI categorization and sentiment analysis
- `api/ai/sentiment` - Sentiment analysis endpoint
- `api/youtube/get-videos` - Fetches user's YouTube videos

### State Management
- Supabase for authentication and data persistence
- React Query (@tanstack/react-query) for server state management
- React Context for analysis page state

### UI Framework
- Tailwind CSS 4 with CSS variables for theming
- shadcn/ui components (New York style) with Radix UI primitives
- Lucide React for icons

### Authentication & Authorization
- Middleware protects `/dashboard`, `/analysis/:id`, and `/auth` routes
- Supabase SSR for server-side authentication
- Google OAuth integration for YouTube API access

## Common Patterns

### Database Operations
Always use the typed Supabase client with proper error handling:
```typescript
const supabase = await createClient();
const { data, error } = await supabase
  .from('table_name')
  .select('*');
```

### API Route Structure
API routes follow this pattern with proper error handling and type safety:
- Import types from `@/types/` directories
- Use NextRequest/NextResponse for proper typing
- Handle environment variable validation

### Component Organization
- Feature-based component organization under `src/components/`
- UI components use shadcn/ui conventions
- Server Actions in dedicated `actions/` directories

## Testing & Quality

The project uses ESLint with Next.js TypeScript rules. The configuration disables `@typescript-eslint/no-explicit-any` warnings.