import { Navbar } from "@/components/navbar/navbar"

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}