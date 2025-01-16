import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import SignOutButton from '@/components/navbar/sign-out-button';
import { ThemeToggle } from '@/components/navbar/theme-toggle';
import { MobileNav } from '@/components/navbar/mobile-nav';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Logo</span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/resume-templates" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Resume Templates
            </Link>
            <Link 
              href="/interview-questions" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Interview Questions
            </Link>
            <Link 
              href="/archives" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Archives
            </Link>
          </div>

          {/* Separator line - only show on desktop */}
          <div className="hidden md:block h-6 w-px bg-border"></div>

          {/* Right section with Auth, Theme Toggle, and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Auth section */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'Profile'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="font-medium">
                    {session.user?.name || session.user?.email}
                  </DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu - Only visible on mobile */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}