'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, UserButton } from '@clerk/nextjs';
import { ArrowRight, CheckCircle } from "lucide-react";
import HeaderSection from "@/components/header/HeaderSection";

export interface UserDetails {
  whatsapp?: string;
  linkedinUrl?: string;
  currentRole?: string;
}

interface UserDetailsStepProps {
  onComplete: (details: UserDetails) => void;
}

export default function OnboardingStep({ onComplete }: UserDetailsStepProps) {
  const { user } = useUser();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState<UserDetails>({
    whatsapp: '',
    linkedinUrl: '',
    currentRole: '',
  });

  const updateFormData = (field: keyof UserDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors for updated field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    // Validate field in real-time
    validateField(field, value);
  };

  const validateField = (field: keyof UserDetails, value: string) => {
    let isValid = false;
    
    switch (field) {
      case 'whatsapp':
        // International phone number validation (optional field)
        if (value.trim() === '') {
          isValid = true; // Optional field
        } else {
          const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
          isValid = phoneRegex.test(value.replace(/\s/g, ''));
        }
        break;
      
      case 'linkedinUrl':
        // LinkedIn URL validation (optional field)
        if (value.trim() === '') {
          isValid = true; // Optional field
        } else {
          const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
          isValid = linkedinRegex.test(value);
        }
        break;
      
      case 'currentRole':
        // Current role validation (optional field)
        if (value.trim() === '') {
          isValid = true; // Optional field
        } else {
          isValid = value.length >= 2 && value.length <= 100 && /^[a-zA-Z\s,.-]+$/.test(value);
        }
        break;
    }

    setValidFields(prev => ({ ...prev, [field]: isValid }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate WhatsApp if provided
    if (formData.whatsapp && formData.whatsapp.trim() !== '') {
      const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
      if (!phoneRegex.test(formData.whatsapp.replace(/\s/g, ''))) {
        newErrors.whatsapp = "Please enter a valid phone number (10-15 digits)";
      }
    }

    // Validate LinkedIn URL if provided
    if (formData.linkedinUrl && formData.linkedinUrl.trim() !== '') {
      const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
      if (!linkedinRegex.test(formData.linkedinUrl)) {
        newErrors.linkedinUrl = "Please enter a valid LinkedIn profile URL";
      }
    }

    // Validate current role if provided
    if (formData.currentRole && formData.currentRole.trim() !== '') {
      if (formData.currentRole.length < 2 || formData.currentRole.length > 100) {
        newErrors.currentRole = "Role must be between 2-100 characters";
      } else if (!/^[a-zA-Z\s,.-]+$/.test(formData.currentRole)) {
        newErrors.currentRole = "Role can only contain letters, spaces, and basic punctuation";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <HeaderSection />
      
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-6 w-full">
        {/* Step Indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            Step 1 of 4 • Your Details
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-border rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: '25%' }}
            ></div>
          </div>
        </div>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex flex-col items-center space-y-2">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }}
              />
              <div className="text-sm text-muted-foreground">
                Welcome, {user?.firstName || user?.fullName || 'there'}!
              </div>
            </div>
            <CardTitle className="text-xl">Complete your profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add optional details to get more personalized assessment results and recommendations.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                <div className="relative">
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="e.g., +1234567890 or +91 9876543210"
                    value={formData.whatsapp}
                    onChange={(e) => updateFormData('whatsapp', e.target.value)}
                    onBlur={(e) => validateField('whatsapp', e.target.value)}
                    className={`${errors.whatsapp ? "border-destructive" : ""} ${
                      validFields.whatsapp && formData.whatsapp ? "border-green-500" : ""
                    }`}
                  />
                  {validFields.whatsapp && formData.whatsapp && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.whatsapp && (
                  <p className="text-sm text-destructive">{errors.whatsapp}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Include country code for international numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                <div className="relative">
                  <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={formData.linkedinUrl}
                    onChange={(e) => updateFormData('linkedinUrl', e.target.value)}
                    onBlur={(e) => validateField('linkedinUrl', e.target.value)}
                    className={`${errors.linkedinUrl ? "border-destructive" : ""} ${
                      validFields.linkedinUrl && formData.linkedinUrl ? "border-green-500" : ""
                    }`}
                  />
                  {validFields.linkedinUrl && formData.linkedinUrl && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.linkedinUrl && (
                  <p className="text-sm text-destructive">{errors.linkedinUrl}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Full LinkedIn profile URL for networking opportunities
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentRole">Current Role (Optional)</Label>
                <div className="relative">
                  <Input
                    id="currentRole"
                    type="text"
                    placeholder="e.g., Product Manager, Software Developer, Scrum Master"
                    value={formData.currentRole}
                    onChange={(e) => updateFormData('currentRole', e.target.value)}
                    onBlur={(e) => validateField('currentRole', e.target.value)}
                    className={`${errors.currentRole ? "border-destructive" : ""} ${
                      validFields.currentRole && formData.currentRole ? "border-green-500" : ""
                    }`}
                    maxLength={100}
                  />
                  {validFields.currentRole && formData.currentRole && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
                {errors.currentRole && (
                  <p className="text-sm text-destructive">{errors.currentRole}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your current job title or professional role (2-100 characters)
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full group"
                  size="lg"
                >
                  Continue to Assessment
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>Your information is secure and will only be used to enhance your assessment experience.</p>
        </div>
        </div>
      </div>
    </div>
  );
}