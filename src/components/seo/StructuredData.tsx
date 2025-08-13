'use client';

import { PersonalityType } from "@/data/personality-types";

interface StructuredDataProps {
  type: 'website' | 'assessment' | 'person' | 'quiz-result';
  data?: {
    url?: string;
    name?: string;
    description?: string;
    personalityType?: PersonalityType;
    userName?: string;
    completionDate?: string;
    slug?: string;
  };
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quiz.theagilecoach.com';

    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "The Agile Assessment",
          "description": "Discover your ideal Scrum team role with our comprehensive 4-dimensional personality assessment. Map your unique behavioral traits to 16 distinct personality types and accelerate your Agile career.",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/results/{search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "author": {
            "@type": "Organization",
            "name": "The Agile Coach",
            "url": "https://theagilecoach.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "The Agile Coach",
            "url": "https://theagilecoach.com",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          }
        };

      case 'assessment':
        return {
          "@context": "https://schema.org",
          "@type": ["Quiz", "EducationalTest"],
          "name": "The Agile Assessment - 4-Dimensional Personality Test",
          "description": "A comprehensive personality assessment that evaluates work style, decision process, communication style, and focus orientation to determine your ideal Agile team role.",
          "url": baseUrl,
          "inLanguage": "en-US",
          "isAccessibleForFree": true,
          "learningResourceType": "Assessment",
          "educationalLevel": "Professional",
          "audience": {
            "@type": "Audience",
            "audienceType": "Professional"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Agile Methodology"
            },
            {
              "@type": "Thing", 
              "name": "Team Dynamics"
            },
            {
              "@type": "Thing",
              "name": "Career Development"
            },
            {
              "@type": "Thing",
              "name": "Personality Assessment"
            }
          ],
          "teaches": [
            "Work Style Preferences",
            "Decision Making Process",
            "Communication Style",
            "Focus Orientation",
            "Agile Team Roles",
            "Career Path Alignment"
          ],
          "timeRequired": "PT10M",
          "interactionCount": "32",
          "author": {
            "@type": "Organization",
            "name": "The Agile Coach"
          },
          "publisher": {
            "@type": "Organization",
            "name": "The Agile Coach",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        };

      case 'quiz-result':
        if (!data?.personalityType || !data?.userName) return null;
        
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": data.userName,
          "description": `${data.userName} is ${data.personalityType.name}. ${data.personalityType.description}`,
          "url": `${baseUrl}/results/${data.slug}`,
          "knowsAbout": data.personalityType.careerPaths,
          "hasSkill": data.personalityType.strengths,
          "worksFor": {
            "@type": "Organization",
            "name": "Agile Team"
          },
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "The Agile Assessment",
            "url": baseUrl
          },
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "name": `${data.personalityType.name} Certification`,
            "description": data.personalityType.description,
            "credentialCategory": "Personality Assessment",
            "educationalLevel": "Professional",
            "recognizedBy": {
              "@type": "Organization",
              "name": "The Agile Coach"
            },
            "dateCreated": data.completionDate,
            "about": {
              "@type": "DefinedTerm",
              "name": data.personalityType.shortName,
              "description": data.personalityType.name,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "Agile Personality Types",
                "description": "16 distinct personality types for Agile team roles"
              }
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "name": `${data.userName}'s Agile Assessment Results`,
            "url": `${baseUrl}/results/${data.slug}`,
            "description": `${data.userName}'s personality assessment results showing ${data.personalityType.name} traits and ideal Agile team roles.`,
            "author": {
              "@type": "Organization",
              "name": "The Agile Coach"
            },
            "publisher": {
              "@type": "Organization",
              "name": "The Agile Coach",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            },
            "datePublished": data.completionDate,
            "dateModified": data.completionDate
          }
        };

      case 'person':
        if (!data?.userName || !data?.personalityType) return null;
        
        return {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "name": data.userName,
            "description": `Professional with ${data.personalityType.name} personality type, skilled in ${data.personalityType.strengths.slice(0, 3).join(', ')}`,
            "hasOccupation": data.personalityType.careerPaths.map(career => ({
              "@type": "Occupation",
              "name": career,
              "occupationLocation": {
                "@type": "Place",
                "name": "Global"
              }
            })),
            "knowsAbout": [
              ...data.personalityType.strengths,
              ...data.personalityType.careerPaths,
              "Agile Methodology",
              "Team Collaboration"
            ],
            "hasSkill": data.personalityType.strengths.map(skill => ({
              "@type": "DefinedTerm",
              "name": skill,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "Professional Skills"
              }
            }))
          }
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}