import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/components/navbar/sign-out-button';
import { MobileNav } from '@/components/navbar/mobile-nav';
import Image from 'next/image';
import { User, Archive, Settings } from 'lucide-react';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 border border-black flex items-center justify-center">
            <span className="font-bold text-xl">Z</span>
          </div>
        </Link>

        {/* Desktop Navigation and User Profile */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/resume-builder" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Resume Builder
            </Link>
          </div>

          {/* Separator */}
          <div className="hidden md:block h-4 w-px bg-gray-200" />

          {/* User profile dropdown - only show on desktop */}
          {session && (
            <div className="hidden md:flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0 rounded-full overflow-hidden"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Profile'}
                        className="h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 p-2">
                    <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white overflow-hidden">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'Profile'}
                          className="h-10 w-10 object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        session.user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{session.user?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2">
                    <Link href="/profile" className="w-full flex items-center gap-2"><User className="w-4 h-4" /><span>My profile</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <Link href="/archives" className="w-full flex items-center gap-2"><Archive className="w-4 h-4" /><span>Archives</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2">
                    <Link href="/settings" className="w-full flex items-center gap-2"><Settings className="w-4 h-4" /><span>Settings</span></Link>
                  </DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Login/Signup buttons - only show on desktop when not logged in */}
          {!session && (
            <div className="hidden md:flex items-center gap-2">
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
            <MobileNav session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}