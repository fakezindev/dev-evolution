import { Routes, Route, Navigate } from "react-router-dom"

import "./styles/theme.css"
import '@fortawesome/fontawesome-free/css/all.min.css'

import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"

import Trilha from "./pages/Trilha"
import Cadastro from "./pages/Cadastro"
import LoginUser from "./pages/LoginUser"
import Perfil from "./pages/Perfil"
import Ligas from "./pages/Ligas"
import Licao1 from "./pages/Licao1"

import PrivateRoute from "./components/Privateroute"

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

      <Route path="/cadastro" element={<Cadastro />} />
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
    <PrivateRoute>
      <Layout>
        <Licao1 />
      </Layout>
    </PrivateRoute>
  }
/>
    </Routes>
  )
}

export default App