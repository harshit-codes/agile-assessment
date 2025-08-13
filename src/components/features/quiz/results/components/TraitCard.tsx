"use client";

import { LucideIcon } from "lucide-react";
import { H4, BodyText } from "@/components/ui/Typography";
import { StarRating, scoreToStars } from "@/components/ui/StarRating";

interface TraitCardProps {
  title: string;
  label: string;
  score: number;
  icon: LucideIcon;
  colorScheme: 'blue' | 'purple' | 'orange' | 'teal' | 'green';
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-950/30',
    border: 'border-blue-800/30',
    hover: 'hover:bg-blue-950/40',
    iconBg: 'bg-blue-600/20',
    ring: 'ring-blue-500/30',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-200',
    labelColor: 'text-blue-300'
  },
  purple: {
    bg: 'bg-purple-950/30',
    border: 'border-purple-800/30',
    hover: 'hover:bg-purple-950/40',
    iconBg: 'bg-purple-600/20',
    ring: 'ring-purple-500/30',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-200',
    labelColor: 'text-purple-300'
  },
  orange: {
    bg: 'bg-orange-950/30',
    border: 'border-orange-800/30',
    hover: 'hover:bg-orange-950/40',
    iconBg: 'bg-orange-600/20',
    ring: 'ring-orange-500/30',
    iconColor: 'text-orange-400',
    titleColor: 'text-orange-200',
    labelColor: 'text-orange-300'
  },
  teal: {
    bg: 'bg-teal-950/30',
    border: 'border-teal-800/30',
    hover: 'hover:bg-teal-950/40',
    iconBg: 'bg-teal-600/20',
    ring: 'ring-teal-500/30',
    iconColor: 'text-teal-400',
    titleColor: 'text-teal-200',
    labelColor: 'text-teal-300'
  },
  green: {
    bg: 'bg-green-950/30',
    border: 'border-green-800/30',
    hover: 'hover:bg-green-950/40',
    iconBg: 'bg-green-600/20',
    ring: 'ring-green-500/30',
    iconColor: 'text-green-400',
    titleColor: 'text-green-200',
    labelColor: 'text-green-300'
  }
};

export default function TraitCard({ 
  title, 
  label, 
  score, 
  icon: Icon, 
  colorScheme 
}: TraitCardProps) {
  const colors = colorSchemes[colorScheme];
  
  return (
    <div className={`p-5 ${colors.bg} rounded-xl border ${colors.border} hover:shadow-md transition-all duration-200 ${colors.hover}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${colors.iconColor}`} />
        </div>
        <div className="flex-1">
          <H4 className={`mb-1 ${colors.titleColor}`}>{title}</H4>
          <BodyText size="small" className={`${colors.labelColor} font-medium`}>{label}</BodyText>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <StarRating rating={scoreToStars(score)} size="md" />
      </div>
    </div>
  );
}