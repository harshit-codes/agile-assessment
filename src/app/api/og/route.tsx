import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // All 16 personality types in order for the 4x4 grid
    const personalityTypes = [
      // Row 1: Structured + Evidence-Based
      { code: 'SEDV', name: 'Systems Architect' },
      { code: 'SEDP', name: 'Process Engineer' },
      { code: 'SEHV', name: 'Stakeholder Orchestrator' },
      { code: 'SEHP', name: 'Growth Facilitator' },
      
      // Row 2: Structured + Intuitive
      { code: 'SIDV', name: 'Technical Strategist' },
      { code: 'SIDP', name: 'Performance Catalyst' },
      { code: 'SIHV', name: 'Innovation Orchestrator' },
      { code: 'SIHP', name: 'Culture Architect' },
      
      // Row 3: Dynamic + Evidence-Based
      { code: 'DEDV', name: 'Market Disruptor' },
      { code: 'DEDP', name: 'Velocity Optimizer' },
      { code: 'DEHV', name: 'Adaptive Strategist' },
      { code: 'DEHP', name: 'Intelligence Coordinator' },
      
      // Row 4: Dynamic + Intuitive
      { code: 'DIDV', name: 'Breakthrough Leader' },
      { code: 'DIDP', name: 'Adaptive Commander' },
      { code: 'DIHV', name: 'Collaborative Innovator' },
      { code: 'DIHP', name: 'Empathetic Transformer' },
    ];

    const colors = {
      primary: '#fafafa', // --primary: 0 0% 98%
      primaryRgb: '250, 250, 250',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 100%)', // Dark background gradient
      accent: '#a3a3a3', // --muted-foreground: 0 0% 63.9%
      text: '#fafafa', // --foreground: 0 0% 98%
      textMuted: '#a3a3a3', // --muted-foreground: 0 0% 63.9%
      card: '#0a0a0a', // --card: 0 0% 3.9%
      border: '#262626' // --border: 0 0% 14.9%
    };

    return new ImageResponse(
      (
        <div
          style={{
            background: colors.background,
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            color: colors.text,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
            position: 'relative',
          }}
        >
          {/* Header with Logo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '25px',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                marginBottom: '15px',
              }}
            >
              <img
                src={new URL('/logo.png', request.url).href}
                alt="Agile Academy"
                width="240"
                height="60"
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>
            
            <div
              style={{
                fontSize: '42px',
                fontWeight: '700',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #c084fc, #6366f1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
              }}
            >
              The Agile Assessment
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: colors.textMuted,
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
              }}
            >
              16 Unique Agile Personalities
            </div>
          </div>

          {/* 8x2 Character Grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {[0, 1].map((row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  gap: '14px',
                  justifyContent: 'center',
                }}
              >
                {personalityTypes.slice(row * 8, (row + 1) * 8).map((type, index) => {
                  const characterUrl = new URL(`/characters/${type.code}.png`, request.url).href;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {/* Character Image */}
                      <div
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '12px',
                          border: `2px solid ${colors.border}`,
                          backgroundColor: colors.card,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4)`,
                        }}
                      >
                        <img
                          src={characterUrl}
                          alt={type.name}
                          width="72"
                          height="72"
                          style={{
                            borderRadius: '8px',
                          }}
                        />
                      </div>
                      
                      {/* Type Code */}
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: colors.text,
                          backgroundColor: colors.card,
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: `1px solid ${colors.border}`,
                          boxShadow: `0 2px 4px rgba(0, 0, 0, 0.3)`,
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                        }}
                      >
                        {type.code}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '30px',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '26px',
                fontWeight: '600',
                color: colors.text,
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
              }}
            >
              Discover Your Perfect Agile Role
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                borderTop: `2px solid ${colors.border}`,
                paddingTop: '15px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: colors.accent,
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    fontSize: '16px',
                    color: colors.textMuted,
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  Powered by The Agile Coach
                </div>
              </div>
              
              <div
                style={{
                  fontSize: '18px',
                  color: colors.text,
                  fontWeight: '600',
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                }}
              >
                quiz.theagilecoach.com
              </div>
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
    console.error('Error generating main OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}