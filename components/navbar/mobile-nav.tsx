import Link from 'next/link';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Menu, User, Archive, Settings } from 'lucide-react';
import SignOutButton from '@/components/navbar/sign-out-button';
import Image from 'next/image';

// Define a specific type for the session
interface SessionUser {
  name?: string;
  email?: string;
  image?: string;
}

interface SessionProps {
  user?: SessionUser;
}

export async function MobileNav({ session }: { session: SessionProps | null }) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-screen mt-4 rounded-none border-0"
        sideOffset={0}
      >

        <DropdownMenuItem className="py-3 px-4">
          <Link href="/resume-builder" className="w-full">
            Resume Builder
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* User Profile Section */}
        {session ? (
          <>
            <DropdownMenuItem className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white overflow-hidden">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'Profile'}
                    className="h-10 w-10 object-cover"
                    width={50}
                    height={50}
                  />
                ) : (
                  session.user?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{session.user?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground">{session.user?.email}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 px-4">
              <Link href="/profile" className="w-full flex items-center gap-2"><User className="w-4 h-4" /><span>My profile</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 px-4">
              <Link href="/archives" className="w-full flex items-center gap-2"><Archive className="w-4 h-4" /><span>Archives</span></Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 px-4">
              <Link href="/settings" className="w-full flex items-center gap-2"><Settings className="w-4 h-4" /><span>Settings</span></Link>
            </DropdownMenuItem>
            <SignOutButton />
          </>
        ) : (
          <>
            <DropdownMenuItem className="py-3 px-4">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                    Login
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 px-4">
              <Link href="/auth/signup" className="w-full">
                <Button className="w-full">
                  Sign up
                </Button>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}