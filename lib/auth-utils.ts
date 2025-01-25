// lib/auth-utils.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import { redirect } from 'next/navigation'

export async function getAuthSession() {
  const session = await getServerSession(authOptions)
  return session
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return session
}

export async function requireNoAuth() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/')
  }
}