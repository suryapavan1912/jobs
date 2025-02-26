"use client"

import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <DropdownMenuItem 
      className="text-red-600 cursor-pointer w-full py-3 px-4 md:px-2 md:py-1.5"
      onClick={() => signOut()}
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </DropdownMenuItem>
  );
}