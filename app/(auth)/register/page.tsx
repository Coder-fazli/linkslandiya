import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  )
}
