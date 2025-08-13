import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H1, H2, H3, BodyText } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Privacy Policy | The Agile Assessment",
  description: "Privacy Policy for The Agile Assessment - how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Link>
          <H1 className="mb-4">Privacy Policy</H1>
          <BodyText variant="muted">Last updated: January 2025</BodyText>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <H2 className="mb-4">Your Privacy Matters</H2>
            <BodyText className="mb-4">
              The Agile Assessment is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our free assessment platform.
            </BodyText>
            <BodyText className="mb-4">
              As a <strong>hobby project</strong> and <strong>free initiative</strong> by The Agile Academy, we collect only the minimum data necessary to provide our service.
            </BodyText>
          </section>

          {/* Information We Collect */}
          <section>
            <H2 className="mb-4">Information We Collect</H2>
            <div className="space-y-4">
              <div>
                <H3 className="mb-2">Account Information</H3>
                <BodyText className="mb-2">
                  When you create an account through <strong>Clerk</strong> (our authentication provider), we collect:
                </BodyText>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Email address</li>
                  <li>Name (if provided)</li>
                  <li>Authentication credentials managed by Clerk</li>
                </ul>
              </div>
              <div>
                <H3 className="mb-2">Assessment Data</H3>
                <BodyText className="mb-2">
                  To provide personality insights, we store:
                </BodyText>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Your responses to assessment questions</li>
                  <li>Generated personality type and traits</li>
                  <li>Assessment completion timestamps</li>
                  <li>Sharing preferences for your results</li>
                </ul>
              </div>
              <div>
                <H3 className="mb-2">Usage Information</H3>
                <BodyText className="mb-2">
                  We automatically collect:
                </BodyText>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address (for security and analytics)</li>
                  <li>Usage patterns and interactions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <H2 className="mb-4">How We Use Your Information</H2>
            <BodyText className="mb-4">
              We use your information solely to:
            </BodyText>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and improve the assessment experience</li>
              <li>Generate your personality insights and recommendations</li>
              <li>Enable result sharing when you choose to share</li>
              <li>Maintain account security and prevent abuse</li>
              <li>Analyze usage patterns to improve our service</li>
              <li>Communicate important updates about the service</li>
            </ul>
          </section>

          {/* Data Storage and Security */}
          <section>
            <H2 className="mb-4">Data Storage and Security</H2>
            <div className="space-y-4">
              <div>
                <H3 className="mb-2">Storage Infrastructure</H3>
                <BodyText>
                  Your data is stored securely using <strong>Convex</strong> (our backend database) and hosted on <strong>Vercel</strong> (our frontend platform). Both providers maintain enterprise-grade security standards.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Authentication Security</H3>
                <BodyText>
                  User authentication is handled by <strong>Clerk</strong>, which provides secure login, session management, and account protection features.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Data Protection</H3>
                <BodyText>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </BodyText>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <H2 className="mb-4">Third-Party Services</H2>
            <BodyText className="mb-4">
              We use the following trusted third-party services:
            </BodyText>
            <div className="space-y-3">
              <div className="bg-muted/20 p-4 rounded-lg">
                <H3 className="mb-2">Clerk (Authentication)</H3>
                <BodyText size="small">
                  Handles user registration, login, and account management. <br />
                  Privacy Policy: <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">clerk.com/privacy</a>
                </BodyText>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <H3 className="mb-2">Convex (Database)</H3>
                <BodyText size="small">
                  Stores assessment data and user information securely. <br />
                  Privacy Policy: <a href="https://convex.dev/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">convex.dev/privacy</a>
                </BodyText>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <H3 className="mb-2">Vercel (Hosting)</H3>
                <BodyText size="small">
                  Hosts our website and handles web traffic. <br />
                  Privacy Policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com/legal/privacy-policy</a>
                </BodyText>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <H2 className="mb-4">Your Rights and Choices</H2>
            <div className="space-y-4">
              <div>
                <H3 className="mb-2">Data Access</H3>
                <BodyText>
                  You can view and download your assessment results at any time through your account dashboard.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Data Correction</H3>
                <BodyText>
                  You can update your account information and retake assessments to correct or update your data.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Data Deletion</H3>
                <BodyText>
                  You can request complete deletion of your account and all associated data. When you delete your account, we permanently remove all your information from our systems, including:
                </BodyText>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Account information and authentication data</li>
                  <li>All assessment responses and results</li>
                  <li>Sharing settings and shared result links</li>
                  <li>Usage history and analytics data</li>
                </ul>
              </div>
              <div>
                <H3 className="mb-2">Sharing Control</H3>
                <BodyText>
                  You have full control over whether to share your results publicly and can enable or disable sharing at any time.
                </BodyText>
              </div>
            </div>
          </section>

          {/* AI and Research */}
          <section>
            <H2 className="mb-4">AI and Research Usage</H2>
            <BodyText className="mb-4">
              We use artificial intelligence to:
            </BodyText>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Generate personality insights and recommendations</li>
              <li>Create assessment content and questions</li>
              <li>Improve our understanding of personality patterns</li>
              <li>Enhance the accuracy of our assessments</li>
            </ul>
            <BodyText className="mt-4">
              All AI processing is done to improve the service quality. Individual responses are not used for external research or commercial purposes.
            </BodyText>
          </section>

          {/* Data Retention */}
          <section>
            <H2 className="mb-4">Data Retention</H2>
            <BodyText>
              We retain your personal information only as long as necessary to provide our service and fulfill the purposes described in this privacy policy. You can request deletion of your account and data at any time, which will result in immediate and permanent removal from our systems.
            </BodyText>
          </section>

          {/* International Users */}
          <section>
            <H2 className="mb-4">International Users</H2>
            <BodyText>
              Our service is available globally. By using our service, you consent to the transfer and processing of your information in accordance with this privacy policy, regardless of your location.
            </BodyText>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <H2 className="mb-4">Changes to This Privacy Policy</H2>
            <BodyText>
              We may update this privacy policy occasionally to reflect changes in our practices or legal requirements. We will notify users of significant changes through our platform or via email.
            </BodyText>
          </section>

          {/* Contact Information */}
          <section>
            <H2 className="mb-4">Contact Us</H2>
            <BodyText className="mb-4">
              If you have questions about this privacy policy or how we handle your data, please contact us:
            </BodyText>
            <div className="bg-muted/20 p-4 rounded-lg">
              <BodyText size="small">
                <strong>The Agile Academy</strong><br />
                Email: Contact through the assessment platform<br />
                Subject: Privacy Policy Inquiry
              </BodyText>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Assessment
            </Link>
            <Link href="/services" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}