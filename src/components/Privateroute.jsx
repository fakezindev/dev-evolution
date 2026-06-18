import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
  // O React olha para o localStorage para ver se a chave do castelo está lá
  const token = localStorage.getItem("token")

  // Se tiver token, ele renderiza a tela (children). Se não, chuta pro /login.
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute