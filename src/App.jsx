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
import ManualConduta from "./pages/ManualConduta"
import LicaoManager from "./pages/LicaoManager"
import PrivateRoute from "./components/Privateroute"
import RotaProtegida from "./components/RotaProtegida"
import AvisoBloqueio from "./components/AvisoBloqueio"
import Mundo2 from "./pages/Mundo2"

// Layout compartilhado: Sidebar + Topbar + conteúdo filho
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
      {/* Rotas públicas */}
      <Route path="/" element={<Navigate to="/cadastro" />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<LoginUser />} />

      {/* Manual precisa de auth mas NÃO usa Layout (sem sidebar/topbar) */}
      <Route path="/manual-conduta" element={<PrivateRoute><ManualConduta /></PrivateRoute>} />

      {/* Rotas protegidas com Layout */}
      <Route path="/dashboard" element={<PrivateRoute><Layout><Trilha /></Layout></PrivateRoute>} />
      <Route path="/perfil"    element={<PrivateRoute><Layout><Perfil /></Layout></PrivateRoute>} />
      <Route path="/ligas"     element={<PrivateRoute><Layout><Ligas /></Layout></PrivateRoute>} />
      <Route path="/licao/:id" element={<PrivateRoute><Layout><LicaoManager /></Layout></PrivateRoute>} />

      {/* Tela de aviso quando o Mundo 2 está bloqueado */}
      <Route path="/aviso-bloqueio" element={<PrivateRoute><AvisoBloqueio /></PrivateRoute>} />

      {/* Mundo 2 com dupla proteção: autenticação + conclusão do Mundo 1 */}
      <Route
        path="/mundo2"
        element={
          <PrivateRoute>
            <RotaProtegida>
              <Layout>
                <Mundo2 />
              </Layout>
            </RotaProtegida>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App