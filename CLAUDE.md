# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with The Agile Assessment repository.

## Common Development Commands

```bash
# Development server
npm run dev

# Convex development server (run in parallel)
npx convex dev

# Build for production
npm run build

# Start production server  
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check

# Bundle analysis
npm run analyze

# Seed Convex database
npx convex run seedData:seedDatabase

# Deploy to production (Convex + frontend)
npx convex deploy --cmd 'npm run build'
```

## Project Architecture

This is a **Next.js 15** personality quiz application with **Convex.dev** backend, featuring a modern **16-personality system** built on **4 behavioral dimensions**, crafted with TypeScript and Tailwind CSS.

### Core Architecture

- **Convex Backend**: Real-time document-relational database with serverless functions
- **Compact Quiz Interface**: Streamlined single-page assessment for optimal completion rates
- **4-Trait Assessment**: Work Style, Decision Process, Communication Style, Focus Orientation (32 total questions, 8 per section)
- **Advanced Scoring**: Real-time calculation with balanced reverse scoring (-2 to +2 scale)  
- **Modern Results**: Professional personality breakdown with animated progress indicators
- **Type Safety**: End-to-end TypeScript from Convex schema to React components

### Key Components

**Convex Schema** (`convex/schema.ts`):
- Modern 4-trait database structure: workStyle, decisionProcess, communicationStyle, focusOrientation
- Type-safe schema with validation for 16-personality system
- Optimized indexes for quiz sessions, responses, and personality matching
- Real-time subscriptions for live progress tracking

**Convex Functions** (`convex/quiz.ts`, `convex/scoring.ts`):
- Server-side quiz CRUD operations and session management
- Advanced scoring calculations with reverse question handling
- Automatic personality type matching and result persistence
- Public result sharing with shareable URLs

**State Management** (`src/hooks/useConvexQuiz.ts`):
- Single source of truth for quiz state with Convex integration
- Real-time queries and optimistic mutations
- Progress tracking, error handling, and session persistence
- Loading states and connection management

**Scoring System** (`src/components/quiz/utils/scoring.ts`):
- Converts Likert scale responses to trait preferences
- Implements balanced reverse scoring for response bias elimination
- Maps 4-trait combinations to 16 distinct personality types
- Calculates confidence scores and overall assessment fit

**Quiz Components**:
- `CompactQuizShell.tsx`: Main quiz container with inline navigation
- `CompactQuestionSection.tsx`: Section display with progress indicators  
- `QuizResults.tsx`: Comprehensive 4-trait results visualization
- `LikertScale.tsx`: Accessible response input with visual feedback

### Modern UI Design System

- **Color Palette**: Calming teal primary with professional gradients
- **Response Scale**: Green (agree) to red (disagree) intuitive gradient
- **Component Library**: Radix UI primitives with custom Tailwind styling
- **Responsive Design**: Mobile-first approach with fluid typography
- **Animation**: Smooth transitions and loading states

### Path Aliases

Uses `@/*` alias mapping to `./src/*` for clean, maintainable imports.

### Tech Stack Integration

- **Next.js 15**: App Router with React 19 and server components
- **TypeScript**: Strict mode with comprehensive type coverage
- **Radix UI**: Accessible primitives (Progress, Dialog, Button, etc.)
- **Lucide React**: Consistent icon system with tree-shaking
- **Tailwind CSS**: Utility-first styling with custom CSS variables
- **Class Variance Authority**: Systematic component variant management
- **Tailwind Merge**: Intelligent conditional class merging
- **Convex**: Backend-as-a-service with real-time capabilities
- **Clerk**: Optional authentication integration (not required for core functionality)

## Development Patterns

### Component Architecture
- **Feature-based Organization**: Components grouped by domain (`features/`, `quiz/`, `ui/`)
- **Atomic Design**: Reusable UI components in `src/components/ui/`
- **Custom Hooks**: Business logic abstracted to `src/hooks/`
- **Type Definitions**: Comprehensive interfaces for all data structures

### Quiz Assessment Flow
1. **Session Creation**: Convex initializes quiz session with unique identifier
2. **Real-time Loading**: Quiz structure and questions loaded from Convex database  
3. **Progressive Answers**: Each response immediately persisted with optimistic UI updates
4. **Live Progress**: Real-time completion tracking across all 4 sections
5. **Server Scoring**: Advanced calculation with personality type matching via Convex functions
6. **Result Storage**: Complete assessment data stored for analytics and sharing

### Styling Conventions
- **Tailwind First**: Prefer utility classes over custom CSS
- **CSS Variables**: Consistent theming with HSL color variables
- **Mobile First**: Progressive enhancement for larger screens
- **Component Variants**: Systematic styling with `cva()` utility
- **Animation**: Purposeful transitions enhancing user experience

## Convex + Vercel Deployment

### Environment Variables Required

**Production (.env.local for development)**:
- `NEXT_PUBLIC_CONVEX_URL` - Auto-generated by `npx convex dev`
- `CONVEX_DEPLOY_KEY` - Generate in Convex dashboard for production
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication (optional)
- `CLERK_SECRET_KEY` - Clerk server-side authentication (optional)
- `NEXT_PUBLIC_BASE_URL` - Domain URL for metadata and sharing

### Deployment Commands

```bash
# Local development (parallel terminals recommended)
npm run dev
npx convex dev

# Database seeding (run once after setup)
npx convex run seedData:seedDatabase

# Production deployment (single command)
npx convex deploy --cmd 'npm run build'

# Vercel deployment with Convex integration  
vercel --prod
```

### Vercel Configuration

1. **Build Command**: `npx convex deploy --cmd 'npm run build'`
2. **Environment Variables**: Add all required variables in Vercel dashboard
3. **Preview Deployments**: Convex automatically creates separate backends per branch
4. **Domain Configuration**: Update `NEXT_PUBLIC_BASE_URL` for result sharing

## Assessment Methodology

### 4-Trait Framework

**Work Style Preferences**:
- Measures preference for structured vs. dynamic work approaches
- Questions assess organization, planning, and flexibility preferences

**Decision Making Process**:
- Evaluates analytical vs. intuitive information processing
- Questions examine data usage, gut instinct reliance, and decision speed

**Communication Style**:
- Determines direct vs. harmonizing communication preferences  
- Questions assess feedback delivery, consensus building, and diplomatic approach

**Focus Orientation**:
- Evaluates visionary vs. people-centered attention focus
- Questions examine strategic thinking vs. team development priorities

### 16 Personality Matrix

The assessment maps 4-trait combinations to 16 personality types:

| Work Style | Decision Process | Communication | Focus | Code | Personality Type |
|------------|------------------|---------------|-------|------|------------------|
| Structured | Evidence-Based | Direct | Visionary | SEDV | The Systems Architect |
| Structured | Evidence-Based | Direct | People-Centered | SEDP | The Process Engineer |
| Structured | Evidence-Based | Harmonizing | Visionary | SEHV | The Stakeholder Orchestrator |
| Structured | Evidence-Based | Harmonizing | People-Centered | SEHP | The Growth Facilitator |
| Structured | Intuitive | Direct | Visionary | SIDV | The Technical Strategist |
| Structured | Intuitive | Direct | People-Centered | SIDP | The Performance Catalyst |
| Structured | Intuitive | Harmonizing | Visionary | SIHV | The Innovation Orchestrator |
| Structured | Intuitive | Harmonizing | People-Centered | SIHP | The Culture Architect |
| Dynamic | Evidence-Based | Direct | Visionary | DEDV | The Market Disruptor |
| Dynamic | Evidence-Based | Direct | People-Centered | DEDP | The Velocity Optimizer |
| Dynamic | Evidence-Based | Harmonizing | Visionary | DEHV | The Adaptive Strategist |
| Dynamic | Evidence-Based | Harmonizing | People-Centered | DEHP | The Intelligence Coordinator |
| Dynamic | Intuitive | Direct | Visionary | DIDV | The Breakthrough Leader |
| Dynamic | Intuitive | Direct | People-Centered | DIDP | The Adaptive Commander |
| Dynamic | Intuitive | Harmonizing | Visionary | DIHV | The Collaborative Innovator |
| Dynamic | Intuitive | Harmonizing | People-Centered | DIHP | The Empathetic Transformer |

## Legacy Code Notes

### Current System Architecture
- **16-Personality System**: Expanded from 8 to 16 types with 4 behavioral dimensions
- **32 Questions**: 8 questions per section with alternating reverse scoring
- **Enhanced Scoring**: Server-side calculation with advanced trait matching
- **Real-time Updates**: Convex provides live data synchronization
- **Shareable Results**: Public and private sharing with optional passcode protection

### Database Schema Evolution
- **4-Trait System**: workStyle, decisionProcess, communicationStyle, focusOrientation
- **Personality Types**: 16 distinct types with enhanced descriptions and career paths
- **Session Tracking**: Comprehensive analytics and progress monitoring
- **User Profiles**: Optional authentication with Clerk integration

## Important Instructions

**Development Standards**:
- Always run `npm run type-check` before committing
- Use the existing component patterns and design system
- Maintain type safety across all new features
- Follow the established file organization structure
- Test quiz flow thoroughly after any scoring changes

**Database Changes**:
- Never modify the 4-trait schema without updating all dependent components
- Use migrations for any structural database changes
- Test personality type reachability after scoring modifications
- Maintain backward compatibility for existing quiz sessions

**UI Consistency**:
- Use existing Tailwind classes and custom CSS variables
- Follow the established color palette and typography scale
- Implement responsive design with mobile-first approach
- Maintain accessibility standards with Radix components

**Performance Requirements**:
- Optimize for Core Web Vitals and mobile performance
- Minimize bundle size and implement code splitting where beneficial
- Use Convex real-time features efficiently
- Implement proper loading and error states