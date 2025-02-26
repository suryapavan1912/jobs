"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  otp: string
}

export default function VerifyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState<FormData>({
    otp: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Only allow numbers and limit to 6 characters
    if (name === 'otp' && !/^\d{0,6}$/.test(value)) return
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResendOTP = async () => {
    if (!email || timeLeft > 0) return

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      toast.success("OTP resent successfully")
      setTimeLeft(30)
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error("Failed to resend OTP", {
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      toast.error("Missing email address", {
        description: "Please go back to the signup page and try again."
      })
      return
    }

    if (formData.otp.length !== 6) {
      toast.error("Invalid verification code", {
        description: "Please enter the 6-digit code sent to your email."
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: formData.otp,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      toast.success("Email verified successfully")
      // Redirect to password setup page
      router.push(`/auth/setup-password?email=${encodeURIComponent(email)}&token=${data.token}`)
    } catch (error) {
      console.error('Verification error:', error)
      toast.error("Verification failed", {
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return <div>Invalid verification link</div>
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-balance text-sm text-muted-foreground">
          We&apos;ve sent a verification code to {email}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            placeholder="123456"
            required
            value={formData.otp}
            onChange={handleChange}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || formData.otp.length !== 6}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center text-sm">
          Didn&apos;t receive the code?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal"
            disabled={timeLeft > 0}
            onClick={handleResendOTP}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
          </Button>
        </div>
      </div>
    </form>
  )
}