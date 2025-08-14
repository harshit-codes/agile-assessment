import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClientType } from '../prisma'

export interface Context {
  prisma: PrismaClientType
  auth: any | null // Simplified to handle Clerk's various auth types
  userId: string | null // Direct access to Clerk user ID
  req: NextApiRequest
  res: NextApiResponse
}

// Input types that match the GraphQL schema
export interface StartQuizSessionInput {
  quizTitle?: string
  ipAddress?: string
  userAgent?: string
  clerkUserId?: string
}

export interface SubmitResponseInput {
  sessionId: string
  questionId: string
  responseValue: number
}

export interface OnboardingDataInput {
  clerkUserId: string
  onboardingData: {
    onboardingComplete: boolean
    whatsapp?: string
    linkedinUrl?: string
    currentRole?: string
  }
}

export interface ToggleSharingInput {
  sessionId: string
  clerkUserId: string
  email: string
  isPublic: boolean
  displayName?: string
  passcode?: string
}

export interface LinkResultInput {
  sessionId: string
  clerkUserId: string
  email: string
  displayName?: string
}

export interface SaveContactInput {
  sessionId: string
  email?: string
  name?: string
}

export interface UpdateUserSlugInput {
  clerkUserId: string
  newSlug: string
}

export interface UpdateDisplayNameInput {
  clerkUserId: string
  displayName: string
}

// Trait enums
export enum WorkStyleTrait {
  STRUCTURED = 'structured',
  DYNAMIC = 'dynamic',
  ADAPTIVE = 'adaptive'
}

export enum DecisionProcessTrait {
  EVIDENCE_BASED = 'evidence-based',
  INTUITIVE = 'intuitive',
  ANALYTICAL = 'analytical'
}

export enum CommunicationStyleTrait {
  DIRECT = 'direct',
  HARMONIZING = 'harmonizing'
}

export enum FocusOrientationTrait {
  VISIONARY = 'visionary',
  PEOPLE_CENTERED = 'people-centered'
}

export enum TeamInteractionTrait {
  COLLABORATIVE = 'collaborative',
  INDIVIDUAL = 'individual'
}

// Section scores interface (matches Convex implementation) - now compatible with Prisma JSON
export interface SectionScores {
  [key: string]: number
  workStyle: number
  decisionProcess: number
  communicationStyle: number
  focusOrientation: number
}

// Trait results interface (matches Convex implementation) - now compatible with Prisma JSON
export interface TraitResults {
  [key: string]: {
    score: number
    trait: string
    label: string
  }
  workStyle: {
    score: number
    trait: 'structured' | 'dynamic'
    label: string
  }
  decisionProcess: {
    score: number
    trait: 'evidence-based' | 'intuitive'
    label: string
  }
  communicationStyle: {
    score: number
    trait: 'direct' | 'harmonizing'
    label: string
  }
  focusOrientation: {
    score: number
    trait: 'visionary' | 'people-centered'
    label: string
  }
}