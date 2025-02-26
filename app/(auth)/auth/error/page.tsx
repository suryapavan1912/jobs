"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthError() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="mt-2 text-muted-foreground">
            There was a problem with the authentication process.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 mt-8">
          <Button asChild>
            <Link href="/auth/login">
              Return to Login
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 