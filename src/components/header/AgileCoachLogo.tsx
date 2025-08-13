// Server Component - Static content only
import Image from "next/image";

export default function AgileCoachLogo() {
  return (
    <div className="flex flex-col items-center mb-8 animate-fade-in">
      <a 
        href="https://theagilecoach.com/product-manager" 
        target="_blank"
        rel="noopener noreferrer"
        className="group hover:scale-105 transition-transform duration-200 flex flex-col items-center space-y-3"
      >
        <Image 
          src="/logo.png" 
          alt="The Agile Coach Logo" 
          width={96} 
          height={96} 
          className="opacity-90 group-hover:opacity-100 transition-opacity duration-200"
        />
        <span className="text-body-large font-medium" style={{color: 'var(--text-secondary)'}}>
          The Agile Coach Presents
        </span>
      </a>
    </div>
  );
}