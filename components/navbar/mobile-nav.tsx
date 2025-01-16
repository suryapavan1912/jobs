import Link from 'next/link';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-64"
      >
        <SheetHeader>
          <SheetTitle className="text-left">Navigation Menu</SheetTitle>
          <SheetDescription className="text-left">Access all site navigation links</SheetDescription>
        </SheetHeader>
        <nav 
          className="flex flex-col space-y-4 mt-8"
          aria-label="Site Navigation"
        >
          <Link 
            href="/resume-templates" 
            className="text-sm font-medium transition-colors hover:text-primary text-left"
          >
            Resume Templates
          </Link>
          <Link 
            href="/interview-questions" 
            className="text-sm font-medium transition-colors hover:text-primary text-left"
          >
            Interview Questions
          </Link>
          <Link 
            href="/archives" 
            className="text-sm font-medium transition-colors hover:text-primary text-left"
          >
            Archives
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}