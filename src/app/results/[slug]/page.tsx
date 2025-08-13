import { Metadata } from "next";
import { notFound } from "next/navigation";
import QuizResults from "@/components/features/quiz/QuizResults";
import { getPersonalityByCode, personalityTypes } from "@/data/personality-types";
import StructuredData from "@/components/seo/StructuredData";

interface PublicResultProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({
  params,
}: PublicResultProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Try to extract personality type from slug
    // Slug format might be: john-smith-SEDV or similar
    const personalityMatch = slug.match(/([A-Z]{4})$/i);
    let personalityType = null;
    let displayName = slug;

    if (personalityMatch) {
      const typeCode = personalityMatch[1].toUpperCase();
      personalityType = getPersonalityByCode(typeCode);
      displayName = slug.replace(/-[A-Z]{4}$/i, '').replace(/-/g, ' ');
    }

    if (personalityType) {
      const characteristics = personalityType.strengths.slice(0, 4).join(',');
      const ogImageUrl = `/api/og/personality-report?name=${encodeURIComponent(personalityType.name)}&shortName=${personalityType.shortName}&userName=${encodeURIComponent(displayName)}&description=${encodeURIComponent(personalityType.description)}&characteristics=${encodeURIComponent(characteristics)}&motto=${encodeURIComponent(`"${personalityType.strengths[0]}"`)}`;

      return {
        title: `${displayName}'s Result: ${personalityType.name} | The Agile Assessment`,
        description: `${displayName} is ${personalityType.name}. ${personalityType.description}. Explore their 4-dimensional personality profile and ideal Agile team roles.`,
        keywords: [
          personalityType.name,
          personalityType.shortName,
          ...personalityType.strengths,
          ...personalityType.careerPaths,
          'agile assessment results',
          'personality type results',
          'team role assessment'
        ],
        openGraph: {
          title: `${displayName}'s Agile Assessment: ${personalityType.name}`,
          description: `${displayName} is ${personalityType.name}. ${personalityType.description}`,
          type: 'profile',
          url: `/results/${slug}`,
          locale: 'en_US',
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: `${displayName}'s Agile Assessment Results: ${personalityType.name}`,
              type: "image/png"
            }
          ],
          siteName: "The Agile Assessment",
        },
        twitter: {
          card: 'summary_large_image',
          site: "@theagilecoach",
          creator: "@theagilecoach",
          title: `${displayName}'s Result: ${personalityType.name}`,
          description: `${personalityType.description}`,
          images: {
            url: ogImageUrl,
            alt: `${displayName}'s Agile Assessment Results`
          }
        },
        alternates: {
          canonical: `https://quiz.theagilecoach.com/results/${slug}`,
        },
        other: {
          'profile:first_name': displayName.split(' ')[0],
          'profile:last_name': displayName.split(' ').slice(1).join(' '),
          'article:author': displayName,
          'article:section': 'Assessment Results',
          'article:tag': personalityType.careerPaths.join(', '),
        }
      };
    } else {
      // Generic result metadata when personality type can't be determined
      return {
        title: `${displayName}'s Agile Assessment Results | The Agile Assessment`,
        description: `See ${displayName}'s 4-dimensional personality profile and discover their ideal Agile team role based on work style, decision process, communication style, and focus orientation.`,
        openGraph: {
          title: `${displayName}'s Agile Assessment Results`,
          description: `Discover ${displayName}'s ideal Agile team role based on their 4-dimensional personality assessment.`,
          type: 'profile',
          url: `/results/${slug}`,
          images: [
            {
              url: `/api/og/personality-report?userName=${encodeURIComponent(displayName)}&name=Agile%20Assessment%20Results&shortName=QUIZ&description=4-dimensional%20personality%20assessment&characteristics=Comprehensive,Data-driven,Career-focused,Team-oriented&motto=Discover%20Your%20Perfect%20Agile%20Role`,
              width: 1200,
              height: 630,
              alt: `${displayName}'s Agile Assessment Results`,
              type: "image/png"
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${displayName}'s Agile Assessment Results`,
          description: `Discover ${displayName}'s ideal Agile team role based on their 4-dimensional personality assessment.`,
          images: [
            `/api/og/personality-report?userName=${encodeURIComponent(displayName)}&name=Agile%20Assessment%20Results&shortName=QUIZ&description=4-dimensional%20personality%20assessment&characteristics=Comprehensive,Data-driven,Career-focused,Team-oriented&motto=Discover%20Your%20Perfect%20Agile%20Role`
          ],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata for results page:', error);
    return {
      title: 'Assessment Results | The Agile Assessment',
      description: 'View comprehensive Agile assessment results and discover ideal team roles.',
      robots: 'noindex, nofollow'
    };
  }
}

export default async function PublicResult({ params }: PublicResultProps) {
  const { slug } = await params;

  // Basic slug validation
  if (!slug || slug.length < 3) {
    notFound();
  }

  // Extract personality type and user name for structured data
  const personalityMatch = slug.match(/([A-Z]{4})$/i);
  let personalityType = null;
  let displayName = slug;

  if (personalityMatch) {
    const typeCode = personalityMatch[1].toUpperCase();
    personalityType = getPersonalityByCode(typeCode);
    displayName = slug.replace(/-[A-Z]{4}$/i, '').replace(/-/g, ' ');
  }

  return (
    <>
      {personalityType && (
        <>
          <StructuredData 
            type="quiz-result" 
            data={{
              userName: displayName,
              personalityType,
              slug,
              completionDate: new Date().toISOString()
            }} 
          />
          <StructuredData 
            type="person" 
            data={{
              userName: displayName,
              personalityType
            }} 
          />
        </>
      )}
      <QuizResults slug={slug} mode="shared" />
    </>
  );
}

// Optional: Generate static paths for popular results
export async function generateStaticParams() {
  // We could pre-generate paths for frequently accessed results
  // For now, we'll use dynamic generation
  return [];
}