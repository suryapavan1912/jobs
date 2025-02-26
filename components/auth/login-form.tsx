"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa"
import { Eye, EyeOff } from "lucide-react"

interface FormData {
  email: string
  password: string
}

export default function LoginForm({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"form">) {
    const [formData, setFormData] = useState<FormData>({
      email: '',
      password: '',
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)
  
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })
  
        if (result?.error) {
          if (result.error.includes('does not have a password set')) {
            toast.error("Google Account Detected", {
              description: "This email is registered with Google. Please use the Google login option below.",
            })
          } else if (result.error.includes('verify your email')) {
            toast.error("Email Not Verified", {
              description: "Please check your email and verify your account before logging in.",
            })
          } else {
            toast.error("Authentication failed", {
              description: result.error,
            })
          }
        } else {
          // Force a full page refresh to update server components
          window.location.href = '/'
        }
      } catch (error) {
        console.error('Login error:', error)
        toast.error("Login failed", {
          description: "An error occurred. Please try again."
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
  
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
  
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </Link> */}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
  
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
  
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
  
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <FaGoogle className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
        </div>
  
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    )
  }