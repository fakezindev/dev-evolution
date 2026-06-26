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

// 1. IMPORTAMOS OS COMPONENTES NOVOS AQUI EM CIMA
import RotaProtegida from "./components/RotaProtegida"
import AvisoBloqueio from "./components/AvisoBloqueio" // ou "./pages/AvisoBloqueio" se você salvou lá
import Mundo2 from "./pages/Mundo2" // O arquivo principal do Mundo 2 que você ainda vai criar

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
  // ATENÇÃO: Variável simulando o progresso (futuramente virá do banco MySQL)
  const alunoTerminouMundo1 = false;

  return (
    <Routes>
      {/* --- SUAS ROTAS ANTIGAS CONTINUAM IGUAIS --- */}
      <Route path="/" element={<Navigate to="/cadastro" />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<LoginUser />} />
      <Route path="/manual-conduta" element={<PrivateRoute><ManualConduta /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Trilha /></Layout></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><Layout><Perfil /></Layout></PrivateRoute>} />
      <Route path="/ligas" element={<PrivateRoute><Layout><Ligas /></Layout></PrivateRoute>} />
      <Route 
        path="/licao/:id" 
        element={
          <PrivateRoute>
            <Layout>
              <LicaoManager />
            </Layout>
          </PrivateRoute>
        } 
      />

      {/* --- INSERIMOS AS ROTAS NOVAS AQUI DENTRO --- */}
      
      {/* Tela de aviso. Colocamos dentro do <Layout> para manter a Sidebar e Topbar aparecendo! */}
      <Route 
        path="/aviso-bloqueio" 
        element={
          <PrivateRoute>
            <Layout>
              <AvisoBloqueio />
            </Layout>
          </PrivateRoute>
        } 
      />

      {/* A Rota do Mundo 2 com DUPLA PROTEÇÃO */}
      <Route 
        path="/mundo2" 
        element={
          <PrivateRoute>
            <RotaProtegida mundo1Concluido={alunoTerminouMundo1}>
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