"use client";

import { BarChart3, Users, Target } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard";
import { H4, BodyText } from "@/components/ui/Typography";

const features = [
  {
    icon: BarChart3,
    title: "4 Core Dimensions",
    description: "Work style, decision process, communication style, and focus orientation",
    delay: "animate-delay-100",
    spotlightColor: "rgba(0, 229, 255, 0.2)" as const
  },
  {
    icon: Users,
    title: "16 Personality Types", 
    description: "Comprehensive profiles with specialized Agile role recommendations and team dynamics",
    delay: "animate-delay-200",
    spotlightColor: "rgba(139, 92, 246, 0.2)" as const
  },
  {
    icon: Target,
    title: "Agile Role Match",
    description: "Personalized Scrum role recommendations and team dynamics insights", 
    delay: "animate-delay-300",
    spotlightColor: "rgba(34, 197, 94, 0.2)" as const
  }
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <SpotlightCard
            key={index}
            className={`animate-slide-up ${feature.delay} transition-all duration-300 hover:scale-[1.02]`}
            spotlightColor={feature.spotlightColor}
          >
            <div className="group text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-8 w-8 text-background" />
              </div>
              <H4 className="mb-3">{feature.title}</H4>
              <BodyText size="small" variant="secondary">
                {feature.description}
              </BodyText>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}