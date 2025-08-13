"use client";

import { useState } from "react";
import { StandardCard } from "@/components/ui/StandardCard";
import { H3, BodyText } from "@/components/ui/Typography";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface OnboardingData {
  whatsapp?: string;
  linkedinUrl?: string;
  currentRole?: string;
}

interface OnboardingQuestionSectionProps {
  onboardingData: OnboardingData;
  onDataChange: (data: OnboardingData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function OnboardingQuestionSection({
  onboardingData,
  onDataChange,
  onValidationChange
}: OnboardingQuestionSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof OnboardingData, value: string) => {
    let isValid = false;
    let errorMessage = "";
    
    switch (field) {
      case 'whatsapp':
        if (value.trim() === '') {
          isValid = true; // Optional field
        } else {
          const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
          isValid = phoneRegex.test(value.replace(/\s/g, ''));
          if (!isValid) {
            errorMessage = "Please enter a valid phone number (10-15 digits)";
          }
        }
        break;
      
      case 'linkedinUrl':
        if (value.trim() === '') {
          isValid = true; // Optional field
        } else {
          const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
          isValid = linkedinRegex.test(value);
          if (!isValid) {
            errorMessage = "Please enter a valid LinkedIn profile URL";
          }
        }
        break;
      
      case 'currentRole':
        if (value.trim() === '') {
          isValid = true; // Optional field
        } else {
          isValid = value.length >= 2 && value.length <= 100 && /^[a-zA-Z\s,.-]+$/.test(value);
          if (!isValid) {
            if (value.length < 2 || value.length > 100) {
              errorMessage = "Role must be between 2-100 characters";
            } else {
              errorMessage = "Role can only contain letters, spaces, and basic punctuation";
            }
          }
        }
        break;
    }

    setValidFields(prev => ({ ...prev, [field]: isValid }));
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));

    // Check overall validation
    const newErrors = { ...errors, [field]: errorMessage };
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    onValidationChange(!hasErrors);

    return isValid;
  };

  const handleFieldChange = (field: keyof OnboardingData, value: string) => {
    const newData = { ...onboardingData, [field]: value };
    onDataChange(newData);
    validateField(field, value);
  };

  const onboardingQuestions = [
    {
      id: 'whatsapp',
      field: 'whatsapp' as keyof OnboardingData,
      statement: "What's your WhatsApp number? (Optional)",
      placeholder: "e.g., +1234567890 or +91 9876543210",
      description: "Include country code for international numbers",
      type: "tel" as const
    },
    {
      id: 'linkedinUrl',
      field: 'linkedinUrl' as keyof OnboardingData,
      statement: "What's your LinkedIn profile URL? (Optional)",
      placeholder: "https://linkedin.com/in/your-profile",
      description: "Full LinkedIn profile URL for networking opportunities",
      type: "url" as const
    },
    {
      id: 'currentRole',
      field: 'currentRole' as keyof OnboardingData,
      statement: "What's your current professional role? (Optional)",
      placeholder: "e.g., Product Manager, Software Developer, Scrum Master",
      description: "Your current job title or professional role (2-100 characters)",
      type: "text" as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <StandardCard variant="filled" className="text-center bg-primary/5 border-primary/20">
        <div className="space-y-3 py-2">
          <H3 className="text-primary">Complete Your Profile</H3>
          <BodyText variant="muted" className="text-sm">
            Add optional details to get more personalized assessment results and recommendations.
            All fields are optional and you can skip any you prefer not to share.
          </BodyText>
        </div>
      </StandardCard>

      {/* Onboarding Questions */}
      <div className="space-y-4">
        {onboardingQuestions.map((question) => {
          const currentValue = onboardingData[question.field] || '';
          const isAnswered = currentValue.trim() !== '';
          const isValid = validFields[question.field];
          const error = errors[question.field];
          
          return (
            <StandardCard
              key={question.id}
              variant={isAnswered ? "filled" : "outlined"}
              size="sm"
              className={`transition-all duration-300 ${
                !isAnswered 
                  ? 'border-primary/30 hover:border-primary/50' 
                  : isValid 
                    ? 'border-success/20 bg-success/5' 
                    : 'border-destructive/20 bg-destructive/5'
              }`}
            >
              <div className="space-y-4">
                {/* Centered Question Header */}
                <div className="text-center">
                  <BodyText className="font-medium leading-relaxed text-sm sm:text-base mb-4">
                    {question.statement}
                  </BodyText>
                  
                  {/* Input Field */}
                  <div className="space-y-2 max-w-md mx-auto">
                    <div className="relative">
                      <Input
                        type={question.type}
                        placeholder={question.placeholder}
                        value={currentValue}
                        onChange={(e) => handleFieldChange(question.field, e.target.value)}
                        onBlur={(e) => validateField(question.field, e.target.value)}
                        className={`${error ? "border-destructive" : ""} ${
                          isValid && currentValue ? "border-success" : ""
                        }`}
                        maxLength={question.field === 'currentRole' ? 100 : undefined}
                      />
                      {isValid && currentValue && (
                        <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-success" />
                      )}
                    </div>
                    {error && (
                      <p className="text-sm text-destructive text-left">{error}</p>
                    )}
                    <p className="text-xs text-muted-foreground text-left">
                      {question.description}
                    </p>
                  </div>
                </div>
              </div>
            </StandardCard>
          );
        })}
      </div>
    </div>
  );
}