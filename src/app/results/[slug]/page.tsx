import { Metadata } from "next";
import { notFound } from "next/navigation";
import QuizResults from "@/components/features/quiz/QuizResults";

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
    // We'll implement the actual data fetching later
    // For now, return generic metadata
    return {
      title: `${slug}'s Agile Assessment Results | The Agile Assessment`,
      description: `See ${slug}'s 3-dimensional personality profile and discover their ideal Agile team role based on work style, decision process, and team interaction preferences.`,
      openGraph: {
        title: `${slug}'s Agile Assessment Results`,
        description: `Discover ${slug}'s ideal Agile team role based on their 3-dimensional personality assessment: work style, decision process, and team interaction style.`,
        type: 'website',
        url: `/results/${slug}`,
        images: [
          {
            url: '/og-result-image.png',
            width: 1200,
            height: 630,
            alt: 'Agile Assessment Results - 3 Core Dimensions',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${slug}'s Agile Assessment Results`,
        description: `Discover ${slug}'s ideal Agile team role based on their 3-dimensional personality assessment.`,
        images: ['/twitter-result-image.png'],
      },
    };
  } catch (error) {
    return {
      title: 'Result Not Found | The Agile Assessment',
      description: 'The requested assessment result could not be found.',
    };
  }
}

export default async function PublicResult({ params }: PublicResultProps) {
  const { slug } = await params;

  // Basic slug validation
  if (!slug || slug.length < 3) {
    notFound();
  }

  return <QuizResults slug={slug} mode="shared" />;
}

// Optional: Generate static paths for popular results
export async function generateStaticParams() {
  // We could pre-generate paths for frequently accessed results
  // For now, we'll use dynamic generation
  return [];
}