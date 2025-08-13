"use client";

import { useState } from 'react';
import Image from 'next/image';
import { getPersonalityByCode } from '@/data/personality-types';

interface PersonalityImageProps {
  personalityType: any; // Could be from database or static data
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function PersonalityImage({ 
  personalityType, 
  size = 'md', 
  className = '' 
}: PersonalityImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32', 
    lg: 'w-56 h-56',
    xl: 'w-72 h-72'
  };
  
  const textSizes = {
    sm: 'text-xl',
    md: 'text-4xl',
    lg: 'text-6xl', 
    xl: 'text-8xl'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get enhanced personality data with character image
  const enhancedPersonality = personalityType?.shortName ? getPersonalityByCode(personalityType.shortName) : null;

  // If we have an image and it hasn't failed to load, show it
  if (enhancedPersonality?.characterImage && !imageError) {
    return (
      <div className={`mx-auto ${sizeClasses[size]} rounded-2xl border-2 border-primary/20 overflow-hidden shadow-lg ${className}`}>
        <Image
          src={enhancedPersonality.characterImage}
          alt={`${personalityType.name || enhancedPersonality.name} character illustration`}
          width={size === 'sm' ? 64 : size === 'md' ? 128 : size === 'lg' ? 224 : 288}
          height={size === 'sm' ? 64 : size === 'md' ? 128 : size === 'lg' ? 224 : 288}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
          onError={handleImageError}
          priority={size === 'lg' || size === 'xl'}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
    );
  }

  // Fallback to stylized shortName block
  return (
    <div className={`mx-auto ${sizeClasses[size]} bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl border-2 border-primary/20 flex items-center justify-center shadow-lg ${className}`}>
      <div className={`${textSizes[size]} font-bold text-primary text-center`}>
        {personalityType?.shortName || '?'}
      </div>
    </div>
  );
}