interface AuthErrorProps {
  message: string
}

export default function AuthError({ message }: AuthErrorProps) {
  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  )
}
