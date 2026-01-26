import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import type { Role } from "../interfaces/auth"

type Props = {
  children: JSX.Element
  roles?: Role[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, hasRole } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to="/" replace />
  }

  return children
}
