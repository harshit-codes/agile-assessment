import { Button } from '@/components/ui/button';
import { StandardCard, CardContent } from '@/components/ui/StandardCard';
import { BodyText, H1 } from '@/components/ui/Typography';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <StandardCard className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          
          <H1 className="mb-4">Page not found</H1>
          
          <BodyText variant="secondary" className="mb-6">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to discovering your perfect Agile role.
          </BodyText>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to homepage
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Search className="w-4 h-4 mr-2" />
                Take assessment
              </Link>
            </Button>
          </div>
        </CardContent>
      </StandardCard>
    </div>
  );
}