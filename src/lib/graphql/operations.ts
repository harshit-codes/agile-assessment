import { gql } from '@apollo/client'

// Quiz Queries
export const GET_QUIZ = gql`
  query GetQuiz($title: String) {
    getQuiz(title: $title) {
      id
      title
      description
      timeLimit
      version
      sections {
        id
        title
        description
        polarTraits {
          left
          right
        }
        statements {
          id
          statement
          isReversed
          displayOrder
        }
        displayOrder
      }
    }
  }
`

export const GET_SESSION_RESPONSES = gql`
  query GetSessionResponses($sessionId: ID!) {
    getSessionResponses(sessionId: $sessionId) {
      id
      sessionId
      questionId
      responseValue
    }
  }
`

export const GET_SESSION_RESPONSES_FOR_RETAKE = gql`
  query GetSessionResponsesForRetake($originalSessionId: ID!, $currentQuizId: ID!) {
    getSessionResponsesForRetake(originalSessionId: $originalSessionId, currentQuizId: $currentQuizId) {
      id
      questionId
      responseValue
    }
  }
`

export const GET_ONBOARDING_DATA_FOR_RETAKE = gql`
  query GetOnboardingDataForRetake($originalSessionId: ID!) {
    getOnboardingDataForRetake(originalSessionId: $originalSessionId) {
      whatsapp
      linkedinUrl
      currentRole
    }
  }
`

export const GET_QUIZ_RESULT = gql`
  query GetQuizResult($sessionId: ID!) {
    getQuizResult(sessionId: $sessionId) {
      id
      sessionId
      personalityType {
        id
        name
        shortName
        description
        detailedDescription
        tagline
        motto
        punchline
        characterAttributes
        characterImage
        strengths
        challenges
        careerPaths
      }
      personalityCode
      sectionScores
      traitScores
      traits
      confidence
      overallFitScore
      overallFit
      calculatedAt
      isPublic
      sharedAt
      hasPasscode
    }
  }
`

export const GET_USER_LATEST_RESULT = gql`
  query GetUserLatestResult($clerkUserId: String!) {
    getUserLatestResult(clerkUserId: $clerkUserId) {
      id
      sessionId
      personalityType {
        id
        name
        shortName
        description
        detailedDescription
        tagline
        motto
        punchline
        characterAttributes
        characterImage
        strengths
        challenges
        careerPaths
      }
      personalityCode
      sectionScores
      traitScores
      traits
      confidence
      overallFitScore
      overallFit
      calculatedAt
      isPublic
      sharedAt
      hasPasscode
    }
  }
`

export const GET_ALL_PERSONALITY_TYPES = gql`
  query GetAllPersonalityTypes {
    getAllPersonalityTypes {
      id
      name
      shortName
      description
      detailedDescription
      tagline
      motto
      punchline
      characterAttributes
      characterImage
      strengths
      challenges
      careerPaths
    }
  }
`

export const GET_PERSONALITY_TYPE_BY_TRAITS = gql`
  query GetPersonalityTypeByTraits(
    $workStyle: WorkStyleTrait!
    $decisionProcess: DecisionProcessTrait!
    $communicationStyle: CommunicationStyleTrait!
    $focusOrientation: FocusOrientationTrait!
  ) {
    getPersonalityTypeByTraits(
      workStyle: $workStyle
      decisionProcess: $decisionProcess
      communicationStyle: $communicationStyle
      focusOrientation: $focusOrientation
    ) {
      id
      name
      shortName
      description
      detailedDescription
      tagline
      motto
      punchline
      characterAttributes
      characterImage
      strengths
      challenges
      careerPaths
    }
  }
`

export const GET_PUBLIC_RESULT = gql`
  query GetPublicResult($slug: String!, $passcode: String) {
    getPublicResult(slug: $slug, passcode: $passcode) {
      userProfile {
        slug
        displayName
        createdAt
        clerkUserId
      }
      result {
        id
        personalityType {
          id
          name
          shortName
          description
          detailedDescription
          tagline
          motto
          punchline
          characterAttributes
          characterImage
          strengths
          challenges
          careerPaths
        }
        personalityCode
        sectionScores
        traitScores
        traits
        confidence
        overallFitScore
        overallFit
        calculatedAt
        isPublic
        sharedAt
      }
      isViewerOwner
      requiresPasscode
      hasPasscode
      invalidPasscode
    }
  }
`

export const GET_USER_SHARING_STATS = gql`
  query GetUserSharingStats($clerkUserId: String!) {
    getUserSharingStats(clerkUserId: $clerkUserId) {
      hasProfile
      slug
      totalResults
      publicResults
      shareUrl
      lastSharedAt
    }
  }
`

// Quiz Mutations
export const START_QUIZ_SESSION = gql`
  mutation StartQuizSession($input: StartQuizSessionInput!) {
    startQuizSession(input: $input) {
      sessionId
      quizId
      clerkUserId
    }
  }
`

export const SUBMIT_RESPONSE = gql`
  mutation SubmitResponse($input: SubmitResponseInput!) {
    submitResponse(input: $input) {
      success
      progress {
        answered
        total
        percentage
      }
    }
  }
`

export const COMPLETE_QUIZ_SESSION = gql`
  mutation CompleteQuizSession($sessionId: ID!) {
    completeQuizSession(sessionId: $sessionId)
  }
`

export const CALCULATE_ASSESSMENT_RESULT = gql`
  mutation CalculateAssessmentResult($sessionId: ID!) {
    calculateAssessmentResult(sessionId: $sessionId) {
      resultId
      scores
      traits
      personalityType {
        id
        name
        shortName
        description
        detailedDescription
        tagline
        motto
        punchline
        characterAttributes
        characterImage
        strengths
        challenges
        careerPaths
      }
      personalityCode
      confidence
      overallFit
      sessionId
      calculatedAt
    }
  }
`

export const UPDATE_ONBOARDING_DATA = gql`
  mutation UpdateOnboardingData($input: OnboardingDataInput!) {
    updateOnboardingData(input: $input) {
      id
      clerkUserId
      email
      slug
      displayName
      onboardingComplete
      name
      whatsapp
      linkedinUrl
      currentRole
      createdAt
      updatedAt
    }
  }
`

export const TOGGLE_RESULT_SHARING = gql`
  mutation ToggleResultSharing($input: ToggleSharingInput!) {
    toggleResultSharing(input: $input) {
      success
      isPublic
      shareUrl
    }
  }
`

export const SAVE_CONTACT_INFO = gql`
  mutation SaveContactInfo($input: SaveContactInput!) {
    saveContactInfo(input: $input)
  }
`

export const DELETE_USER_ACCOUNT = gql`
  mutation DeleteUserAccount($clerkUserId: String!) {
    deleteUserAccount(clerkUserId: $clerkUserId) {
      success
      message
    }
  }
`

export const LINK_RESULT_TO_USER = gql`
  mutation LinkResultToUser($sessionId: ID!, $clerkUserId: String!, $email: String!, $displayName: String) {
    linkResultToUser(sessionId: $sessionId, clerkUserId: $clerkUserId, email: $email, displayName: $displayName) {
      success
      userProfile {
        id
        slug
        displayName
      }
    }
  }
`

export const GET_SHARING_STATS = gql`
  query GetSharingStats($clerkUserId: String!) {
    getUserSharingStats(clerkUserId: $clerkUserId) {
      hasProfile
      slug
      totalResults
      publicResults
      shareUrl
      lastSharedAt
    }
  }
`

export const GET_SHAREABLE_URL = gql`
  query GetShareableUrl($sessionId: ID!, $clerkUserId: String!) {
    getShareableUrl(sessionId: $sessionId, clerkUserId: $clerkUserId) {
      shareUrl
      slug
      isPublic
      sharedAt
    }
  }
`

export const GET_USER_PROFILE = gql`
  query GetUserProfile($clerkUserId: String!) {
    getUserProfile(clerkUserId: $clerkUserId) {
      id
      clerkUserId
      email
      slug
      displayName
      onboardingComplete
      name
      whatsapp
      linkedinUrl
      currentRole
      createdAt
      updatedAt
    }
  }
`

export const GET_PERSONALITY_TYPE_BY_SHORT_NAME = gql`
  query GetPersonalityTypeByShortName($shortName: String!) {
    getPersonalityTypeByShortName(shortName: $shortName) {
      id
      name
      shortName
      description
      detailedDescription
      tagline
      motto
      punchline
      characterAttributes
      characterImage
      strengths
      challenges
      careerPaths
    }
  }
`