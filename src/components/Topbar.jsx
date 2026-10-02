import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/topbar.css"
import { obterLiga } from "../utils/ligas"
import { API_BASE_URL } from "../api/config"

function Topbar() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    // 1. Criamos a função que busca os dados atualizados
    const carregarDados = () => {
      const token = localStorage.getItem("token")
      if (!token) return

      fetch(`${API_BASE_URL}/api/alunos/meu-perfil`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        // Se o token expirou ou é inválido, desloga o usuário corretamente
        if (res.status === 401 || res.status === 403) {
          console.warn("Topbar: token expirado. Redirecionando para login...")
          localStorage.removeItem("token")
          localStorage.removeItem("auth")
          navigate("/login")
          return null
        }
        if (!res.ok) {
          console.error("Topbar: erro inesperado ao buscar perfil:", res.status)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (!data) return // saiu cedo por erro acima
        setUsuario(data)
        if (data.aceitouManual === false) {
          navigate("/manual-conduta")
        }
      })
      .catch(err => console.error("Topbar: falha de rede ao buscar perfil:", err))
    }

    // 2. Chama a função logo que a tela carrega (comportamento normal)
    carregarDados()

    // 3. Fica com o "ouvido colado" esperando o grito das Lições
    window.addEventListener('atualizarPerfil', carregarDados)

    // 4. Limpeza de segurança quando o componente for desmontado
    return () => window.removeEventListener('atualizarPerfil', carregarDados)
  }, [navigate])

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  // obterLiga agora vem de src/utils/ligas.js — fonte única da verdade

  const ligaInfo = usuario ? obterLiga(usuario.xpTotal) : { nome: "...", cor: "#fff", icone: "fa-star" }

  return (
    <div className="topbar-container">
      <div className="topbar-content">
        <div className="topbar-left">
          {/* Espaço para logo ou menu hamburger, se precisar futuramente */}
        </div>

        <div className="topbar-right">
          {usuario && (
            <>
              <div className="tb-badge admin">
                <i className="fa-solid fa-gear"></i> {usuario.username.toUpperCase()}
              </div>

              {/* Trocamos a classe 'fire' pela 'heart' e o ícone */}
              <div className="tb-badge heart">
                <i className="fa-solid fa-heart"></i> {usuario.vidasAtuais !== undefined ? usuario.vidasAtuais : 5}
              </div>

              <div className="tb-badge gem">
                <i className="fa-solid fa-gem"></i> {usuario.gemas !== undefined ? usuario.gemas : 0}
              </div>

              <div className="tb-badge level">
                <div className="level-col">
                  <span style={{ color: ligaInfo.cor, fontWeight: "bold" }}>
                    <i className={`fa-solid ${ligaInfo.icone}`}></i> Liga {ligaInfo.nome}
                  </span>
                  <span className="level-sub">
                    {usuario.xpTotal} XP Acumulado
                  </span>
                </div>
              </div>
            </>
          )}

          <button className="tb-btn-sair" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

export default Topbar