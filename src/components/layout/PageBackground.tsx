// Server Component - Static background only
export default function PageBackground() {
  return (
    <>
      {/* Clean Dark Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-card to-background -z-50" />
      
      {/* Subtle Grid Pattern - Neutral */}
      <div 
        className="fixed inset-0 opacity-[0.02] -z-30" 
        style={{
          backgroundImage: `
            linear-gradient(hsl(0, 0%, 50%, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0, 0%, 50%, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </>
  );
}