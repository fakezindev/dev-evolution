import { Routes, Route, Navigate } from "react-router-dom"

function PrivateRoute({ children }) {

  const auth = localStorage.getItem("auth")

  return auth ? children : <Navigate to="/login" />
}

import "./styles/theme.css"
import '@fortawesome/fontawesome-free/css/all.min.css'

import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"

import Trilha from "./pages/Trilha"
import Login from "./pages/Login"
import LoginUser from "./pages/LoginUser"
import Perfil from "./pages/Perfil"
import Dashboard from "./pages/Dashboard"

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

      <Route path="/dashboard" element={<Dashboard />} />

      <Route 
  path="/dashboard"
  element={
    <Layout>
      <Trilha />
    </Layout>
  }
/>

<Route 
  path="/perfil"
  element={
    <Layout>
      <Perfil />
    </Layout>
  }
/>
    </Routes>


  )
}

export default App