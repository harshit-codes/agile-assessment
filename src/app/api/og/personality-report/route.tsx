import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const personalityName = searchParams.get('name') || 'Your Personality Type';
    const shortName = searchParams.get('shortName') || 'TYPE';
    const userName = searchParams.get('userName') || 'User';
    const characteristics = searchParams.get('characteristics')?.split(',') || [];
    const description = searchParams.get('description') || 'Discover your unique Agile personality profile';
    const motto = searchParams.get('motto') || '';

    // Get branding configuration from database
    // Since we're in Edge runtime, we'll use defaults and eventually move to a separate branding API
    const brandingConfig = {
      companyName: "The Agile Coach",
      websiteUrl: "quiz.theagilecoach.com", 
      logoPath: "/logo.png",
      poweredByText: "Powered by The Agile Coach",
    };

    // Color scheme based on personality type
    const getColorScheme = (shortName: string) => {
      // Dynamic types get blue tones
      if (shortName.startsWith('D')) {
        return {
          primary: '#6495ED',
          primaryRgb: '100, 149, 237',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%)',
          accent: '#4F46E5'
        };
      }
      // Structured types get green tones
      else if (shortName.startsWith('S')) {
        return {
          primary: '#10b981',
          primaryRgb: '16, 185, 129',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f1f5f9 100%)',
          accent: '#059669'
        };
      }
      // Default to teal
      return {
        primary: '#10b981',
        primaryRgb: '16, 185, 129',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)',
        accent: '#0d9488'
      };
    };

    const colors = getColorScheme(shortName);
    
    // Load logo and character image from public directory
    const logoUrl = new URL(brandingConfig.logoPath, request.url).href;
    const characterImageUrl = new URL(`/characters/${shortName}.png`, request.url).href;

    return new ImageResponse(
      (
        <div
          style={{
            background: colors.background,
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            padding: '50px',
            color: '#0f172a',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Header - Your Agile DNA Report */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {/* DNA Icon representation */}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: colors.primary,
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.primary,
                }}
              >
                {userName ? `${userName}'s Agile Assessment` : 'Your Agile DNA Report'}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              flex: 1,
            }}
          >
            {/* Character Image */}
            <img
              src={characterImageUrl}
              alt={personalityName}
              width="120"
              height="120"
              style={{ 
                imageRendering: 'pixelated',
                marginBottom: '20px',
                borderRadius: '16px',
                border: `3px solid rgba(${colors.primaryRgb}, 0.4)`,
                boxShadow: `0 8px 16px rgba(${colors.primaryRgb}, 0.2)`,
                background: `rgba(${colors.primaryRgb}, 0.05)`,
              }}
            />

            {/* Personality Name */}
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#0f172a',
                maxWidth: '600px',
                textAlign: 'center',
              }}
            >
              {personalityName}
            </div>

            {/* Type Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: `rgba(${colors.primaryRgb}, 0.15)`,
                border: `2px solid rgba(${colors.primaryRgb}, 0.3)`,
                borderRadius: '9999px',
                padding: '8px 16px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: colors.accent,
                }}
              >
                {shortName}
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '18px',
                maxWidth: '550px',
                lineHeight: '1.4',
                textAlign: 'center',
              }}
            >
              {description}
            </div>

            {/* Key Characteristics */}
            {characteristics.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    marginBottom: '8px',
                  }}
                >
                  Key Characteristics
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'center',
                    maxWidth: '500px',
                  }}
                >
                  {characteristics.slice(0, 5).map((char, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: colors.primary,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: '600',
                        border: `1px solid ${colors.accent}`,
                        boxShadow: `0 3px 6px rgba(${colors.primaryRgb}, 0.2)`,
                      }}
                    >
                      {char.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motto */}
            {motto && (
              <div
                style={{
                  display: 'flex',
                  background: `linear-gradient(90deg, rgba(${colors.primaryRgb}, 0.1), rgba(${colors.primaryRgb}, 0.05))`,
                  border: `2px solid rgba(${colors.primaryRgb}, 0.3)`,
                  borderRadius: '16px',
                  padding: '16px 24px',
                  marginBottom: '10px',
                  maxWidth: '600px',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.accent,
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  "{motto.replace(/['"]/g, '')}"
                </div>
              </div>
            )}
          </div>

          {/* Footer with branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '2px solid #e2e8f0',
              paddingTop: '15px',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img
                src={logoUrl}
                alt={brandingConfig.companyName}
                width="40"
                height="12"
                style={{ objectFit: 'contain' }}
              />
              <div
                style={{
                  display: 'flex',
                  fontSize: '12px',
                  color: '#64748b',
                }}
              >
                {brandingConfig.poweredByText}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                color: colors.primary,
                fontWeight: '600',
              }}
            >
              {brandingConfig.websiteUrl}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}