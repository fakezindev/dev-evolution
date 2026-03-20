import { Routes, Route, Navigate } from "react-router-dom"

import "./styles/theme.css"
import '@fortawesome/fontawesome-free/css/all.min.css'

import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"

import Trilha from "./pages/Trilha"
import Login from "./pages/Login"
import LoginUser from "./pages/LoginUser"
import Perfil from "./pages/Perfil"
import Ligas from "./pages/Ligas"
import Licao1 from "./pages/Licao1"

function PrivateRoute({ children }) {
  const auth = localStorage.getItem("auth")
  return auth ? children : <Navigate to="/login" />
}

function Layout({ children }) {
  return (
    <div className="layout">

      <Sidebar />

      <div className="content">
        <Topbar />
        {children}
      </div>

    </div>
  )
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/cadastro" />} />

      <Route path="/cadastro" element={<Login />} />
      <Route path="/login" element={<LoginUser />} />

      <Route 
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Trilha />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route 
        path="/perfil"
        element={
          <PrivateRoute>
            <Layout>
              <Perfil />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route 
        path="/ligas"
        element={
          <PrivateRoute>
            <Layout>
              <Ligas />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route 
  path="/licao/:id"
  element={
    <Layout>
      <Licao1 />
    </Layout>
  }
/>
    </Routes>
  )
}

export default App