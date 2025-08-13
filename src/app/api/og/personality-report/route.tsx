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
      companyName: "Agile Academy",
      websiteUrl: "theagilecoach.com", 
      logoPath: "/logo.png",
      poweredByText: "Powered by Agile Academy",
    };
    
    // Load logo and character image from public directory
    const logoUrl = new URL(brandingConfig.logoPath, request.url).href;
    const characterImageUrl = new URL(`/characters/${shortName}.png`, request.url).href;

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
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
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                Your Agile DNA Report
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
              width="100"
              height="100"
              style={{ 
                imageRendering: 'pixelated',
                marginBottom: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '9999px',
                padding: '6px 14px',
                marginBottom: '15px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                Type: {shortName}
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
                  {characteristics.slice(0, 6).map((char, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #10b981',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(6, 214, 160, 0.1))',
                  border: '2px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  marginBottom: '10px',
                  maxWidth: '500px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0f172a',
                    textAlign: 'center',
                  }}
                >
                  💫 {motto}
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
                color: '#10b981',
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