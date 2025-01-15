"use client"

import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function SignOutButton() {
  return (
    <DropdownMenuItem 
      className="text-red-600 cursor-pointer"
      onClick={() => signOut()}
    >
      Sign out
    </DropdownMenuItem>
  );
}