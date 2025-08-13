import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H1, H2, H3, BodyText } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Terms of Service | The Agile Assessment",
  description: "Terms of Service for The Agile Assessment - a free initiative for discovering your Agile personality.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Link>
          <H1 className="mb-4">Terms of Service</H1>
          <BodyText variant="muted">Last updated: January 2025</BodyText>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <H2 className="mb-4">Welcome to The Agile Assessment</H2>
            <BodyText className="mb-4">
              The Agile Assessment is a free initiative powered by <strong>The Agile Academy</strong>, designed to help individuals and teams discover their Agile personality and optimize their collaboration. By using our service, you agree to these terms.
            </BodyText>
            <BodyText className="mb-4">
              This is a <strong>hobby project</strong> and <strong>non-commercial initiative</strong>. We expect fair usage and understanding from our community.
            </BodyText>
          </section>

          {/* Nature of Service */}
          <section>
            <H2 className="mb-4">Nature of Service</H2>
            <div className="space-y-4">
              <div>
                <H3 className="mb-2">Free Initiative</H3>
                <BodyText>
                  This assessment is provided completely free of charge as an educational and self-reflection tool. There are no hidden fees, subscriptions, or premium features.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Hobby Project</H3>
                <BodyText>
                  This is a passion project created to benefit the Agile community. While we strive for accuracy and reliability, please understand the volunteer nature of this initiative.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">AI-Generated Content</H3>
                <BodyText>
                  We use artificial intelligence to create assessment content, generate insights, and conduct research. This helps us provide comprehensive personality analysis while maintaining our free service model.
                </BodyText>
              </div>
            </div>
          </section>

          {/* Fair Usage */}
          <section>
            <H2 className="mb-4">Fair Usage Policy</H2>
            <BodyText className="mb-4">
              We expect reasonable and fair usage of our service. This includes:
            </BodyText>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Taking the assessment for personal or team development purposes</li>
              <li>Sharing results in good faith for professional growth</li>
              <li>Not attempting to overload or abuse our systems</li>
              <li>Respecting the educational nature of the tool</li>
              <li>Understanding this is not a substitute for professional psychological evaluation</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <H2 className="mb-4">User Responsibilities</H2>
            <div className="space-y-4">
              <div>
                <H3 className="mb-2">Honest Participation</H3>
                <BodyText>
                  For accurate results, please answer assessment questions honestly and thoughtfully.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Appropriate Sharing</H3>
                <BodyText>
                  When sharing results, please do so respectfully and with appropriate context about the tool's purpose.
                </BodyText>
              </div>
              <div>
                <H3 className="mb-2">Account Security</H3>
                <BodyText>
                  You are responsible for maintaining the security of your account and any activities that occur under your account.
                </BodyText>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section>
            <H2 className="mb-4">Service Limitations</H2>
            <BodyText className="mb-4">
              As a free hobby project, please understand:
            </BodyText>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>We cannot guarantee 100% uptime or availability</li>
              <li>Features may change or be discontinued without notice</li>
              <li>Support is provided on a best-effort basis</li>
              <li>The service is provided "as is" without warranties</li>
            </ul>
          </section>

          {/* Data and Privacy */}
          <section>
            <H2 className="mb-4">Data and Privacy</H2>
            <BodyText className="mb-4">
              We use <strong>Clerk</strong> for user management and <strong>Convex</strong> for data storage. When you request data deletion, we completely remove your information from our systems.
            </BodyText>
            <BodyText>
              For detailed information about how we handle your data, please see our <Link href="/policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </BodyText>
          </section>

          {/* Modifications */}
          <section>
            <H2 className="mb-4">Changes to Terms</H2>
            <BodyText>
              We may update these terms occasionally to reflect changes in our service or legal requirements. Continued use of the service after changes constitutes acceptance of new terms.
            </BodyText>
          </section>

          {/* Contact */}
          <section>
            <H2 className="mb-4">Contact</H2>
            <BodyText>
              For questions about these terms or our service, please contact us through The Agile Academy or via the assessment platform.
            </BodyText>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Assessment
            </Link>
            <Link href="/policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}